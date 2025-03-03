/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

import _ from "lodash";

import View from "../../base/view";
import template from "./template";

export default class NLPView extends View {
  constructor(el, context) {
    const handleFeelChange = (e) => {
      const feel = e.target.value;
      if (feel) {
        this.context.api
          .parse(this.context.patient.toParse(feel))
          .then((response) => {
            console.log(response);

            this.updateObservations(response.mentions);
            this.updateTriage(this.context.patient.observations);
          });
      }
    };

    const binds = {
      "#input-feel": {
        type: "input",
        listener: _.debounce(handleFeelChange, 1000),
      },
    };

    super(el, template, context, binds);
    this.observations = this.context.patient.observations || [];
  }

  async updateTriage(observations) {
    const evidence = observations.map((obs) => ({
      id: obs.id,
      source: "initial",
      choice_id: obs.choice_id,
    }));

    const payload = {
      evidence,
      sex: this.context.patient.sex,
      age: this.context.patient.age,
    };

    this.context.api.triagePayload = JSON.stringify(payload, null, 2);
    console.log("Triage request payload: ", JSON.stringify(payload, null, 2));

    try {
      const result = await this.context.api.triage(payload);
      console.log("Evidence list: " + JSON.stringify(payload, null, 2));
      console.log("Triage response:", result);
      // ✅ Update triage level
      this.context.api.triageLevel = result.triage_level;

      // ✅ Preserve observations before rendering
      this.context.patient.observations = [...this.observations];

      // ✅ Re-render to update triage level
      this.render();

      // ✅ Restore observations after re-render
      setTimeout(() => {
        this.updateObservations(this.context.patient.observations);
      }, 0);
    } catch (error) {
      console.error("Error in triage:", error);
    }
  }

  updateObservations(newObservations) {
    // ✅ Merge new observations with existing ones
    newObservations.forEach((newObs) => {
      // Check if observation already exists
      if (!this.observations.some((obs) => obs.id === newObs.id)) {
        this.observations.push(newObs);
      }
    });

    this.context.patient.observations = this.observations; // ✅ Ensure persistence
    let t = "";
    for (const o of this.observations) {
      t += `
        <li>
          <i class="text-${o.choice_id === "present" ? "success" : "danger"} 
            fa fa-fw fa-${
              o.choice_id === "present" ? "plus" : "minus"
            }-circle"></i>
          ${o.common_name}
        </li>
      `;
    }
    setTimeout(() => {
      const observationsContainer = this.el.querySelector("#observations");
      if (observationsContainer) {
        observationsContainer.innerHTML = t;
      } else {
        console.warn("⚠️ Observations container not found after render.");
      }
    }, 0);

    this.checkObservations();
  }

  checkObservations() {
    const present = (element) => element.choice_id === "present";
    if (this.observations.some(present)) {
      document.getElementById("next-step").removeAttribute("disabled");
    } else {
      document.getElementById("next-step").setAttribute("disabled", "true");
    }
  }

  saveObservations() {
    if (_.isEmpty(this.observations)) {
      return;
    }
    const pairs = this.observations.map((item) => {
      const val = {
        reported: item.choice_id === "present",
      };

      if (val.reported) {
        Object.assign(val, {
          source: "initial",
        });
      }
      return [item.id, val];
    });
    const o = _.fromPairs(pairs);
    console.log("saving symptoms");
    this.context.patient.addSymptomsGroup(o);
  }

  destroy() {
    this.saveObservations();
    super.destroy();
  }
}
