import { fillAuditData, makeCpu, startConnector } from "./home-styles.js";
import { fillBattery, makeBattery } from "./battery.js";
import { getCookie } from "../helpers/cookies.js";
import { getData } from "./query.js";
import { showActivity } from "./ratio.js";
import { currentProject, makeRAM } from "./skills.js";
import { makeHDD } from "./hdd.js";
import { makeGPU } from "./progress-graph.js";
import { initXpGraph } from "./xpGraph.js";
import { renderSkillsRadar } from "./skillsRadar.js";

async function validateUser() {
  const token = getCookie("token");
  if (!token) {
    window.location.href = "/login/";
    return null;
  }
  console.log(token);
  try {
    const resp = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            user {
              email
            }
          }
        `,
      }),
    });

    if (!resp.ok) {
      window.location.href = "/login/";
      return null;
    }

    const data = await resp.json();

    if (data.errors) {
      console.error(data.errors);
      window.location.href = "/login/";
      return null;
    }

    console.log(data.data.user);
    return token;
  } catch (err) {
    console.error(err);
    window.location.href = "/login/";
    return null;
  }
}

async function init() {

  validateUser();
  makeCpu();
  makeRAM();
  makeBattery();
  startConnector();
  makeHDD();
  makeGPU();
  initXpGraph();
  let data = await getData();

  let latestActivity = [];

  for (let i = data.transaction.length - 1; i >= 0 && latestActivity.length < 5; i--) {
    if (data.transaction[i].type !== 'xp') {
      continue;
    }
    latestActivity.push(data.transaction[i]);
  }
  showActivity(latestActivity);
  currentProject(data)
  fillAuditData(data.audit)
  renderSkillsRadar(data)

  document.getElementById('to-activity').addEventListener('click', () => {
    window.location.href = "/activity/";
  });

  document.querySelector('.audit-history-btn').addEventListener('click', () => {
    window.location.href = "/audit-history/";
  })

}

init();