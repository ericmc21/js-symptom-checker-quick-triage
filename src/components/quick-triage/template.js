/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

import html from "../../templates/helpers";

const template = (context) => {
  return context.api
    .formatTriage(context.patient.toDiagnosis())
    .then((data) => {
      return html`
        <h5 class="card-title">Quick Triage Check</h5>
        <div class="card-text">
          ${data}
          <div class="alert alert-warning" role="alert">
            <i class="fa fa-info-circle"></i>
            Please note that this was our "Quick Triage" flow. For the most
            accurate results, continue to the end of the interview.
          </div>

          <button class="btn btn-primary">Book an appointment</button><br />
        </div>
        <a
          href="https://metabase.infermedica.com/build/simulation/?interview=${context
            .api.interviewId}"
          target="_blank"
          >${context.api.interviewId}</a
        >
        <p>Triage: ${context.api.triageFormatted || "Processing..."}</p>
        <p>${context.api.triagePayload}</p>
        <!-- ✅ Ensure value is defined -->
      `;
    });
};

export default template;
