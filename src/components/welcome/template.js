/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

const template = (context) => {
  return new Promise((resolve) => {
    resolve(`
      <h5 class="card-title">Welcome to the <b>Triage</b> vs. <b>has_emergency_evidence</b> Demo</h5>
      <div class="card-text">
        <p>
          We created this example to view and compare an flow that calls  the /triage endpoint throughout the interview with instead using the has_emergency_evidence flag in the /diagnosis endpoint to trigger an interview stop if an emergency is suspected.
        </p>
        <p>
          Visit our 
          <i class="fa fa-github"></i> 
          <a href="https://github.com/infermedica/js-symptom-checker-example">GitHub page</a> 
          to grab the source code of this example as well as a guide on how to start working with it.
        </p>
        <p>
          The most recent API documentation is always available on our 
          <a href="https://developer.infermedica.com/docs/api">developer portal</a>.
        </p>
        <p>
          Please click 
          <span class="badge badge-primary">Next</span> 
          to move to the first question.
        </p>
        <p class="text-muted small">
          <i class="fa fa-info-circle"></i> 
          This is the welcome screen. In a real life scenario you will probably want to display T&C here. 
          In the background, the new 
          <a target="_blank" href="https://developer.infermedica.com/docs/diagnosis#helping-us-improve-the-engine">
            Interview-Id
          </a>
          was created. </p>
      </div>
    `);
  });
};

export default template;
