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
            this.updateTriage(response.mentions);
            return this.updateObservations(response.mentions);
          });
      }
    };

    const binds = {
      "#input-feel": {
        type: "input",
        listener: _.debounce(handleFeelChange, 400),
      },
    };

    super(el, template, context, binds);
    this.observations = {};
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

    console.log("Triage request payload: ", JSON.stringify(payload, null, 2));

    try {
      const result = await this.context.api.triage(payload);
      console.log("Triage response:", result);
      this.context.api.triageLevel = result.triage_level;
      this.render();
      this.updateObservations;
    } catch (error) {
      console.error("Error in triage:", error);
    }
  }

  updateObservations(observations) {
    this.observations = observations;
    let t = "";
    for (const o of observations) {
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
    this.el.querySelector("#observations").innerHTML = t;
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
    this.context.patient.addSymptomsGroup(o);
  }

  destroy() {
    this.saveObservations();
    super.destroy();
  }
}
