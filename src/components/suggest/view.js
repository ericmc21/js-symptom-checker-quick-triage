/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

import View from "../../base/view";
import template from "./template";

export default class SuggestView extends View {
  constructor(el, context) {
    context.data = context.patient.toSuggest();

    const handleSymptomsChange = (e) => {
      const group = {};
      this.el.querySelectorAll(".input-symptom").forEach((item) => {
        // we do not mark any symptoms that comes from suggest as absent
        if (item.checked) {
          group[item.id] = { reported: true, source: "suggest" };
        } else {
          // completely remove this symptom
          this.context.patient.removeSymptom(item.id);
        }
      });

      this.context.patient.addSymptomsGroup(group);
    };

    const binds = {
      ".input-symptom": {
        type: "change",
        listener: handleSymptomsChange,
      },
    };

    super(el, template, context, binds);

    // ✅ Call updateTriage after the instance is initialized
    this.initTriage();
  }

  async initTriage() {
    // Ensure context exists before making the call
    if (!this.context || !this.context.api) {
      console.error("Context or API not available.");
      return;
    }

    console.log("Initializing triage...");

    try {
      // Assume an empty list or previously stored observations
      const observations = this.context.patient.observations || [];
      await this.updateTriage(observations);
    } catch (error) {
      console.error("Error initializing triage:", error);
    }
  }

  async updateTriage(observations) {
    try {
      const result = await this.context.api.triage(
        this.context.patient.toDiagnosis()
      );

      console.log("Triage response:", result);
      this.context.api.triageLevel = result.triage_level;
      this.render();
    } catch (error) {
      console.error("Error in triage:", error);
    }
  }
}
