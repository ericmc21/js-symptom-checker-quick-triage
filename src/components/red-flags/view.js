/**
 * Created by Eric McLean @ Infermedica on 09/05/2022.
 */

import View from "../../base/view";
import template from "./template";

export default class RedFlagsView extends View {
  constructor(el, context) {
    context.data = context.patient.toSuggest();

    const handleSymptomsChange = (e) => {
      const group = {};
      this.el.querySelectorAll(".input-symptom").forEach((item) => {
        // ✅ Record both checked and unchecked symptoms
        group[item.id] = {
          reported: item.checked,
          source: "suggest",
        };
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
      // ✅ Only call render if it hasn’t been triggered before
      if (!this.hasRendered) {
        this.hasRendered = true;
        this.render();
      }
    } catch (error) {
      console.error("Error in triage:", error);
    }
  }
}
