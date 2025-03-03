/**
 * Created by Tomasz Gabrysiak @ Infermedica on 02/02/2017.
 */

export default class InfermedicaApi {
  constructor(
    appId,
    appKey,
    apiModel = "infermedica-en",
    apiUrl = "https://api.infermedica.com/v3/"
  ) {
    this.appId = appId;
    this.appKey = appKey;

    this.apiUrl = apiUrl;
    this.apiModel = apiModel;

    this.interviewId = null;
    this.triageResult = null;
    this.triageLevel = null;
    this.hasEmergencyEvidence = null;
    this.triagePayload = null;
  }

  getInterviewId() {
    return this.interviewId;
  }

  generateInterviewId() {
    const uuidv4 = function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      ); // eslint-disable-line
    };

    this.interviewId = uuidv4();
  }

  request(method, url, data) {
    const headers = new Headers();
    headers.append("App-Id", this.appId);
    headers.append("App-Key", this.appKey);
    headers.append("Model", this.apiModel);
    headers.append("Content-Type", "application/json");

    if (this.interviewId) {
      headers.append("Interview-Id", this.interviewId);
    }

    return fetch(this.apiUrl + url, {
      method,
      headers,
      body: data,
    }).then((response) => {
      return response.json();
    });
  }

  get(url) {
    return this.request("GET", url);
  }

  post(url, data) {
    return this.request("POST", url, data);
  }

  getSymptoms(age) {
    return this.get(`symptoms?age.value=${age.value}`);
  }

  getRiskFactors(data) {
    data.suggest_method = "demographic_risk_factors";
    return this.post("suggest", JSON.stringify(data));
  }

  parse(data) {
    return this.post("parse", JSON.stringify(data));
  }

  getSuggestedSymptoms(data) {
    data.suggest_method = "symptoms";
    return this.post("suggest", JSON.stringify(data));
  }

  getRedFlags(data) {
    data.suggest_method = "red_flags";
    return this.post("suggest?max_results=12", JSON.stringify(data));
  }

  diagnosis(data) {
    this.returnStr = this.formatTriage(data);
    return this.post("diagnosis", JSON.stringify(data));
  }

  triage(data) {
    return this.post("triage", JSON.stringify(data));
  }

  explain(data) {
    return this.post("explain", JSON.stringify(data));
  }

  formatTriage(data) {
    return this.triage(data).then((value) => {
      this.returnStr = "";
      if (value.triage_level === "emergency_ambulance") {
        this.returnStr =
          "<h2>Call an ambulance</h2><p>Your symptoms are very severe ";
        this.returnStr += "and you may need emergency care.</p>";
      } else if (value.triage_level === "emergency") {
        this.returnStr =
          "<h2>Emergency</h2><p>Your symptoms are worrying and you may need ";
        this.returnStr +=
          "urgent medical attention. If you cannot get to an emergency room, ";
        this.returnStr += "please call an ambulance.</p>";
      } else if (value.triage_level === "consultation_24") {
        this.returnStr =
          "<h2>See a doctor within 24 hours</h2><p>Your symptoms may need a medical ";
        this.returnStr +=
          "evaluation right away. If your symptoms suddenly worsen, go ";
        this.returnStr += "to the nearest emergency room.</p>";
      } else if (value.triage_level === "consultation") {
        this.returnStr =
          "<h2>Consult a doctor</h2><p>Your symptoms may require a ";
        this.returnStr +=
          "medical evaluation. Make an appointment with your doctor. ";
        this.returnStr +=
          "If your symptoms worsen, see a doctor right away</p>";
      } else {
        this.returnStr =
          "<h2>Self-treatment can be sufficient</h2><p>Usually your symptoms do ";
        this.returnStr +=
          "not require medical attention and may improve on their own. ";
        this.returnStr +=
          "You can try to get your disease under control with home remedies. ";
        this.returnStr +=
          "If your symptoms worsen or new symptoms appear, seek medical advice immediately.</p>";
      }
      return this.returnStr;
    });
  }
}
