// Adapted version of https://github.com/Stremio/stremio-addon-sdk/blob/v1.6.2/src/landingTemplate.js
import { CustomManifest } from './types';
import { envGet } from './utils';

const STYLESHEET = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  width: 100%;
  min-height: 100%;
}

html {
  background: #000;
  overflow-x: hidden;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Rajdhani', Arial, sans-serif;
  color: #fff;
  padding: 2vh;
  position: relative;
}

/* Animated background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 100, 0, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 0, 128, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 60% 80%, rgba(0, 200, 255, 0.06) 0%, transparent 60%),
    linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%);
  z-index: 0;
}

/* Scanline effect */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
  z-index: 0;
}

#addon {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255, 100, 0, 0.2);
  border-radius: 16px;
  padding: 3vh 4vh;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 0 40px rgba(255, 100, 0, 0.08),
    0 0 80px rgba(255, 0, 128, 0.04),
    inset 0 1px 0 rgba(255,255,255,0.05);
  animation: fadeSlideIn 0.6s ease both;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Logo */
.logo {
  width: 90px;
  height: 90px;
  margin: 0 auto 2.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 100, 0, 0.05);
  border: 1px solid rgba(255, 100, 0, 0.25);
  box-shadow: 0 0 20px rgba(255, 100, 0, 0.15), 0 0 40px rgba(255, 0, 128, 0.08);
  overflow: hidden;
}

.logo img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(255,100,0,0.6));
}

/* Title row */
.title-row {
  text-align: center;
  margin-bottom: 0.5vh;
}

.name {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(22px, 4vh, 30px);
  font-weight: 900;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #ff6400, #ff0080, #00c8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  display: inline-block;
}

.version {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(10px, 1.4vh, 13px);
  font-weight: 400;
  color: rgba(255,255,255,0.4);
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 2vh;
}

/* Divider */
.neon-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,100,0,0.5), rgba(255,0,128,0.5), transparent);
  margin: 2vh 0;
  border: none;
}

/* Description */
.description {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(13px, 1.8vh, 15px);
  font-weight: 300;
  color: rgba(255,255,255,0.65);
  line-height: 1.6;
  text-align: center;
  margin-bottom: 0;
}

/* Info blocks */
.info-block {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 1.5vh 2vh;
  margin-bottom: 1.5vh;
  font-size: clamp(12px, 1.6vh, 14px);
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
}

.info-block a {
  color: #ff6400;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.info-block a:hover {
  color: #ff0080;
}

/* Section label */
.section-label {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(9px, 1.2vh, 11px);
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255,100,0,0.7);
  text-transform: uppercase;
  margin-bottom: 1vh;
}

/* Types list */
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8vh;
  margin: 0;
}

ul li {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(11px, 1.5vh, 13px);
  font-weight: 600;
  letter-spacing: 1px;
  padding: 0.4vh 1.2vh;
  border-radius: 4px;
  background: rgba(255,100,0,0.08);
  border: 1px solid rgba(255,100,0,0.2);
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
}

/* Form elements */
.form-element {
  margin-bottom: 1.8vh;
}

.label-to-top {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(9px, 1.1vh, 11px);
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,100,0,0.7);
  text-transform: uppercase;
  margin-bottom: 0.8vh;
}

input[type="text"],
input[type="number"],
input[type="password"],
select {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,100,0,0.25);
  border-radius: 6px;
  padding: 1vh 1.5vh;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(13px, 1.7vh, 15px);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus {
  border-color: rgba(255,100,0,0.6);
  box-shadow: 0 0 12px rgba(255,100,0,0.15);
}

select option {
  background: #111;
  color: #fff;
}

label {
  display: flex;
  align-items: center;
  gap: 1vh;
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(13px, 1.7vh, 15px);
  color: rgba(255,255,255,0.7);
  cursor: pointer;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #ff6400;
  cursor: pointer;
}

/* Install button */
a.install-link {
  text-decoration: none;
  display: block;
  margin-top: 2vh;
}

button {
  width: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(13px, 1.8vh, 15px);
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #fff;
  padding: 1.6vh 3vh;
  border-radius: 8px;
  background: linear-gradient(90deg, #ff6400, #ff0080);
  box-shadow: 0 0 20px rgba(255,100,0,0.3), 0 0 40px rgba(255,0,128,0.15);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

button:hover::before {
  transform: translateX(100%);
}

button:hover {
  box-shadow: 0 0 30px rgba(255,100,0,0.5), 0 0 60px rgba(255,0,128,0.25);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(255,100,0,0.3);
}

/* Contact */
.contact {
  text-align: center;
  margin-top: 2vh;
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(11px, 1.4vh, 13px);
  color: rgba(255,255,255,0.3);
}

.contact a {
  color: rgba(255,100,0,0.6);
  text-decoration: none;
  font-style: italic;
}

.contact a:hover {
  color: #ff6400;
}

/* Separator utility */
.separator {
  margin-bottom: 2vh;
}

.full-width { width: 100%; }
.label-to-right { margin-left: 0.5vh; }
`;

export function landingTemplate(manifest: CustomManifest) {
  const logo = manifest.logo || 'https://dl.strem.io/addon-logo.png';
  const contactHTML = manifest.contactEmail
    ? `<div class="contact">
      <p>Contact ${manifest.name} creator:</p>
      <a href="mailto:${manifest.contactEmail}">${manifest.contactEmail}</a>
    </div>`
    : '';

  const stylizedTypes = manifest.types
    .map(types => types.charAt(0).toUpperCase() + types.slice(1) + (types !== 'series' ? 's' : ''));

  let formHTML = '';
  let script = '';

  if ((manifest.config || []).length) {
    let options = '';
    manifest.config.forEach((elem) => {
      const key = elem.key;
      if (['text', 'number', 'password'].includes(elem.type)) {
        const isRequired = elem.required ? ' required' : '';
        const defaultHTML = elem.default ? ` value="${elem.default}"` : '';
        const inputType = elem.type;
        options += `
        <div class="form-element">
          <div class="label-to-top">${elem.title}</div>
          <input type="${inputType}" id="${key}" name="${key}" class="full-width"${defaultHTML}${isRequired}/>
        </div>
        `;
      } else if (elem.type === 'checkbox') {
        const isChecked = elem.default === 'checked' ? ' checked' : '';
        options += `
        <div class="form-element">
          <label for="${key}">
            <input type="checkbox" id="${key}" name="${key}"${isChecked}> <span class="label-to-right">${elem.title}</span>
          </label>
        </div>
        `;
      } else if (elem.type === 'select') {
        const defaultValue = elem.default || (elem.options || [])[0];
        options += `<div class="form-element">
        <div class="label-to-top">${elem.title}</div>
        <select id="${key}" name="${key}" class="full-width">
        `;
        const selections = elem.options || [];
        selections.forEach((el) => {
          const isSelected = el === defaultValue ? ' selected' : '';
          options += `<option value="${el}"${isSelected}>${el}</option>`;
        });
        options += `</select>
               </div>
               `;
      }
    });
    if (options.length) {
      formHTML = `
      <form class="pure-form" id="mainForm">
        ${options}
      </form>
      <div class="separator"></div>
      `;
      script += `
      installLink.onclick = () => {
        return mainForm.reportValidity()
      }
      const updateLink = () => {
        const config = Object.fromEntries(new FormData(mainForm))
        config.mediaFlowProxyUrl = config.mediaFlowProxyUrl.replace(/^https?.\\/\\//, '');
        installLink.href = 'stremio://' + window.location.host + '/' + encodeURIComponent(JSON.stringify(config)) + '/manifest.json'
      }
      mainForm.onchange = updateLink
      `;
    }
  }

  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${manifest.name} - Stremio Addon</title>
    <style>${STYLESHEET}</style>
    <link rel="shortcut icon" href="${logo}" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@2.1.0/build/pure-min.css" integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH" crossorigin="anonymous">
  </head>

  <body>
    <div id="addon">

      <div class="logo">
        <img src="${logo}" alt="logo">
      </div>

      <div class="title-row">
        <h1 class="name">${manifest.name}</h1>
      </div>
      <div class="version">v${manifest.version || '0.0.0'}</div>

      <hr class="neon-divider">

      <div class="description">
        <small>${manifest.description.replace(/\n/g, '<br>') || ''}</small>
      </div>

      <hr class="neon-divider">

      <div class="info-block">
        The source code can be found on <a href="https://github.com/webstreamr/webstreamr" target="_blank">GitHub</a>.
      </div>

      ${envGet('CONFIGURATION_DESCRIPTION') ? `<div class="info-block">${envGet('CONFIGURATION_DESCRIPTION')}</div>` : ''}

      <div class="info-block">
        Note: HTTP streams have limitations. For a better experience, use a Debrid service and WebStreamr as fallback.
        <a href="https://torbox.app/subscription?referral=f22eb00d-27ce-4e20-85fc-68da3d018b99" target="_blank"><strong>TorBox</strong></a> is working very well.
      </div>

      <div class="separator"></div>

      <div class="section-label">Supported Types</div>
      <ul>
        ${stylizedTypes.map(t => `<li>${t}</li>`).join('')}
      </ul>

      <hr class="neon-divider">

      ${formHTML}

      <a id="installLink" class="install-link" href="#">
        <button name="Install">⚡ Install Addon</button>
      </a>

      ${contactHTML}

    </div>
    <script>
      ${script}

      if (typeof updateLink === 'function')
        updateLink()
      else
        installLink.href = 'stremio://' + window.location.host + '/manifest.json'
    </script>
  </body>

  </html>`;
}
