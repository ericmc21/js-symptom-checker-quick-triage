/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

import View from "../../base/view";
import template from "./template";

export default class QuestionView extends View {
  constructor(el, context) {
    const handleNextQuestion = (e) => {
      const group = {};
      if (this.context.question.type !== "single") {
        this.el.querySelectorAll(".custom-control-input").forEach((item) => {
          group[item.id] = { reported: item.checked };
        });
        this.context.patient.addSymptomsGroup(group);
        this.destroy();
        this.updateTriageDisplay();
        this.render();
      } else {
        const val = {
          false: false,
          true: true,
          "unknown:": undefined,
        };
        this.context.patient.addSymptomsGroup({
          [this.context.question.items[0].id]: {
            reported: val[e.target.dataset.value],
          },
        });
        this.destroy();
        this.updateTriageDisplay();
        this.render();
      }
    };

    const binds = {
      ".next-question": {
        type: "click",
        listener: handleNextQuestion,
      },
    };

    super(el, template, context, binds);
    // ✅ Call updateTriageDisplay() when the question view loads
    this.updateTriageDisplay();
  }

  render() {
    this.el.innerHTML =
      '<p><i class="fa fa-circle-o-notch fa-spin fa-fw"></i> I am thinking...</p>';
    this.context.api
      .diagnosis(this.context.patient.toDiagnosis())
      .then((data) => {
        this.context.question = data.question;

        // check stop condition
        if (data.should_stop === true) {
          this.destroy();
          document.getElementById("next-step").removeAttribute("disabled");
          document.getElementById("next-step").click();
        } else {
          super.render();
        }

        return data;
      });
  }

  async updateTriageDisplay() {
    try {
      console.log("Amy I getting called again?");
      const data = await this.context.api.triage(
        this.context.patient.toDiagnosis()
      );

      // ✅ Store data in context before rendering
      this.context.api.triageFormatted = data.triage_level;
    } catch (error) {
      console.error("Error fetching formatted triage data:", error);
    }
  }
}
