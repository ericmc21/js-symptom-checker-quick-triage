/**
 * Created by Tomasz Gabrysiak @ Infermedica on 08/02/2017.
 */

import html from '../../templates/helpers';

const template = (context) => {
  return new Promise((resolve) => {
    resolve(html`
      <h5 class="card-title">Tell us how you feel.</h5>
      <div class="card-text">
        <form>
          <div class="form-group">
            <label for="input-feel">
              Please enter your symptoms or what is bothering you the most.
            </label>
            <textarea placeholder="e.g. I have a headache and a sore throat." 
            class="form-control" id="input-feel" rows="4"></textarea>
          </div>
        </form>
        <p>Initial symptoms:</p>
        <ul class="list-unstyled" id="observations">
        </ul>
        <p class="text-muted small">
          <i class="fa fa-exclamation-circle"></i>
          Please note that you can go <span class="badge badge-primary">Next</span> only if there are 
          <span class="text-success">present <i class="fa fa-plus-circle"></i></span>
          identified observations.
        </p>
        <p class="text-muted small">
          <i class="fa fa-info-circle"></i> This screen uses our NLP engine to find symptoms in a written text.
          Evidence found in text will be marked as initial which is important to our engine. 
          Please read more about initial evidence 
          <a target="_blank" href="https://developer.infermedica.com/docs/diagnosis#gathering-initial-evidence">
            here
          </a>.
          All of the identified symptoms will be added to your interview after clicking
          <span class="badge badge-primary">Next</span>.
        </p>
      </div>
      <p>Interview ID: ${context.api.interviewId}</p>
    `);
  });
};

export default template;
