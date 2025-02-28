/**
 * Created by Eric McLean @ Infermedica on 09/05/2022.
 */

import View from "../../base/view";
import template from "./template";

export default class CommonRisksView extends View {
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
  }
}
