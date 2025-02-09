/* eslint-disable */

module.exports = async function() {
  // Put clean up logic here (e.g. stopping services, docker-compose.yml, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
