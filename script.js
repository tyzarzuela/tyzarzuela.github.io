let currentSlideIndex = 0;

window.moveCarousel = function(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  const texts = document.querySelectorAll('.carousel-text');

  if (!slides.length || !texts.length) return;

  slides[currentSlideIndex].querySelectorAll('video').forEach(vid => {
    vid.pause();
    vid.currentTime = 0;
  });

  slides[currentSlideIndex].classList.remove('active');
  texts[currentSlideIndex].classList.remove('active');

  currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;

  const nextSlide = slides[currentSlideIndex];
  nextSlide.classList.add('active');
  texts[currentSlideIndex].classList.add('active');

  const activeVideo = nextSlide.querySelector('video');
  if (activeVideo) {
    activeVideo.play().catch(error => {
      console.log('Autoplay bloqueado:', error);
    });
  }
};

let currentSelectedProject = 1;

function getProjectTemplate(data, colorClass = 'title-green') {
  const mediaList = Object.values(data.media || {});

  const slidesHTML = mediaList.map((item, index) => {
    const isActive = index === 0 ? 'active' : '';
    const isVideo = item.src
      ? (item.src.endsWith('.mp4') || item.type === 'video')
      : item.type === 'video';

    return `
      <div class="carousel-slide ${isActive}">
        ${
          isVideo
            ? `<video controls preload="metadata">
                <source src="${item.src}" type="video/mp4">
              </video>`
            : `<img src="${item.src}" alt="${item.alt || ''}" />`
        }
      </div>
    `;
  }).join('');

  const textsHTML = mediaList.map((item, index) => {
    const isActive = index === 0 ? 'active' : '';
    const number = String(index + 1).padStart(2, '0');

    return `
      <div class="carousel-text ${isActive}">
        <h4 class="${colorClass}">${number}. ${item.title || ''}</h4>
        <p>${item.desc || ''}</p>
      </div>
    `;
  }).join('');

  const overviewHTML = (data.overviewParagraphs || [])
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('');

  const contributionSectionsHTML = data.contributionSections
    ? data.contributionSections.map(section => `
        <div class="contribution-section">
          <h5 class="section-subtitle ${colorClass}">${section.title}</h5>
          <ul class="contributions-list">
            ${section.items.map(c => `
              <li>
                <strong class="${colorClass}">${c.title}</strong>
                :${c.desc}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')
    : `
        <ul class="contributions-list">
          ${(data.contributions || []).map(c => `
            <li>
              <strong class="${colorClass}">${c.title}</strong>
              :${c.desc}
            </li>
          `).join('')}
        </ul>
      `;

  return `
    <div style="width: 100%; max-width: 1100px; margin: 0 auto;">

      <!-- MEDIA CAROUSEL -->
      <div class="carousel-container">

        ${
          mediaList.length > 1
            ? `<button class="carousel-btn prev" onclick="moveCarousel(-1)">&#10094;</button>`
            : ''
        }

        <div class="carousel-media-wrapper">
          ${slidesHTML}
        </div>

        ${
          mediaList.length > 1
            ? `<button class="carousel-btn next" onclick="moveCarousel(1)">&#10095;</button>`
            : ''
        }

        <div class="carousel-description-wrapper">
          ${textsHTML}
        </div>

      </div>

      <!-- OVERVIEW LEFT / PROJECT METADATA RIGHT -->
      <div class="project-top-grid">

        <!-- OVERVIEW -->
        <div class="details-col">
          <h4 class="section-title ${colorClass}">Overview</h4>

          <div class="overview-content">
            ${overviewHTML}
          </div>
        </div>

        <!-- PROJECT METADATA -->
        <div class="details-col">
          <h4 class="section-title ${colorClass}">Project Metadata</h4>

          <div class="metadata-list">

            <div>
              <strong>Engine & Stack:</strong>
              ${data.meta.engine}
            </div>

            <div>
              <strong>Role:</strong>
              ${data.meta.role}
            </div>

            <div>
              <strong>Team Size:</strong>
              ${data.meta.team}
            </div>

            <div>
              <strong>Duration:</strong>
              ${data.meta.duration}
            </div>

            ${
              data.meta.grade
                ? `
                  <div>
                    <strong>Grade:</strong>
                    <span class="${colorClass}">
                      ${data.meta.grade}
                    </span>
                  </div>
                `
                : ''
            }

            ${
              (data.meta.thesisPdf || data.meta.reportPdf)
                ? `
                  <div>
                    <strong>Project PDF:</strong>
                    <a
                      href="${data.meta.thesisPdf || data.meta.reportPdf}"
                      download
                      target="_blank"
                      class="meta-link ${colorClass}"
                    >
                      Download Memory (PDF)
                    </a>
                  </div>
                `
                : ''
            }

            ${
              data.meta.repo
                ? `
                  <div>
                    <strong>Repository:</strong>
                    <a
                      href="${data.meta.repo}"
                      target="_blank"
                      class="meta-link ${colorClass}"
                    >
                      GitHub Repo
                    </a>
                  </div>
                `
                : ''
            }

            ${
              data.meta.itchio
                ? `
                  <div>
                    <strong>Itch.io:</strong>
                    <a
                      href="${data.meta.itchio}"
                      target="_blank"
                      class="meta-link ${colorClass}"
                    >
                      Play on Itch.io
                    </a>
                  </div>
                `
                : ''
            }

            <hr class="meta-divider">

            <div>
              <strong>Keywords:</strong><br>
              <span style="color: #888; font-size: 0.85rem;">
                ${data.meta.keywords}
              </span>
            </div>

          </div>
        </div>

      </div>

     <!-- MIDDLE IMAGE / VIDEO -->
      ${
        data.middleImageSrc
          ? `
            <div class="project-media-placeholder">
              <div class="image-placeholder-box" style="display: flex; justify-content: center; align-items: center; background: #000; border-radius: 8px; overflow: hidden;">
                ${
                  data.middleImageSrc.endsWith('.mp4') || data.middleImageSrc.endsWith('.webm')
                    ? `<video controls preload="metadata" style="max-width: 100%; max-height: 450px; width: auto; height: auto; object-fit: contain; display: block;">
                        <source src="${data.middleImageSrc}" type="video/mp4">
                       </video>`
                    : `<img
                        src="${data.middleImageSrc}"
                        alt="Project Demonstration / Diagram"
                       />`
                }
              </div>
            </div>
          `
          : ''
      }

      <!-- PERSONAL CONTRIBUTIONS -->
      <div class="details-col personal-contributions-section">

        <h4 class="section-title ${colorClass}">
          Personal Contributions
        </h4>

        ${contributionSectionsHTML}

      </div>

      <!-- ACTION BUTTONS -->
      <div class="modal-actions">

        ${
          (data.meta.thesisPdf || data.meta.reportPdf)
            ? `
              <a
                href="${data.meta.thesisPdf || data.meta.reportPdf}"
                download
                target="_blank"
                class="modal-footer-btn ${colorClass}-btn"
              >
                Download Memory Document
              </a>
            `
            : ''
        }

        ${
          data.meta.repo
            ? `
              <a
                href="${data.meta.repo}"
                target="_blank"
                class="modal-footer-btn secondary"
              >
                View Repository
              </a>
            `
            : ''
        }
        ${
          data.meta.itchio
            ? `
              <a
                href="${data.meta.itchio}"
                target="_blank"
                class="modal-footer-btn secondary"
              >
                Play on Itch.io
              </a>
            `
            : ''
        }

      </div>

    </div>
  `;
}


/* =========================================================
   UNSTRUNG PROJECT TEMPLATE
   ========================================================= */

function getUnstrungTemplate(data, colorClass = 'title-orange') {
  const mediaList = Object.values(data.media || {});

  const slidesHTML = mediaList.map((item, index) => {
    const isActive = index === 0 ? 'active' : '';
    const isVideo = item.src
      ? (item.src.endsWith('.mp4') || item.type === 'video')
      : item.type === 'video';

    return `
      <div class="carousel-slide ${isActive}">
        ${
          isVideo
            ? `<video controls preload="metadata">
                <source src="${item.src}" type="video/mp4">
              </video>`
            : `<img src="${item.src}" alt="${item.alt || ''}" />`
        }
      </div>
    `;
  }).join('');

  const textsHTML = mediaList.map((item, index) => {
    const isActive = index === 0 ? 'active' : '';
    const number = String(index + 1).padStart(2, '0');

    return `
      <div class="carousel-text ${isActive}">
        <h4 class="${colorClass}">
          ${number}. ${item.title || ''}
        </h4>
        <p>${item.desc || ''}</p>
      </div>
    `;
  }).join('');

  currentSlideIndex = 0;

// Generador de la barra de botones en color naranja
  const renderActionButtons = () => {
    const buttons = [];

    if (data.resources?.steam) {
      buttons.push(`
        <a href="${data.resources.steam}" target="_blank" class="project-btn btn-orange-primary">
          Steam Page
        </a>
      `);
    }

    if (data.resources?.linkedin) {
      buttons.push(`
        <a href="${data.resources.linkedin}" target="_blank" class="project-btn btn-orange-secondary">
          LinkedIn
        </a>
      `);
    }

    if (data.resources?.instagram) {
      buttons.push(`
        <a href="${data.resources.instagram}" target="_blank" class="project-btn btn-orange-secondary">
          Instagram
        </a>
      `);
    }

    if (buttons.length === 0) return '';

    return `
      <div class="project-action-buttons" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
        ${buttons.join('')}
      </div>
    `;
  };
const inlineImage = (src, alt) => {
  if (!src) return '';
  
  // Extraer la ruta si src es un objeto o una cadena de texto
  const path = typeof src === 'object' ? src.src : src;
  const isVideo = path.endsWith('.mp4') || path.endsWith('.webm');

  return `
    <div
      class="unstrung-inline-image"
      style="
        width: 100%;
        margin: 38px 0 48px;
        display: flex;
        justify-content: center;
      "
    >
      <div
        style="
          width: 100%;
          max-width: 900px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          border-radius: 10px;
          overflow: hidden;
        "
      >
        ${
          isVideo
            ? `<video controls preload="metadata" style="display: block; width: 100%; height: auto;">
                <source src="${path}" type="video/mp4">
               </video>`
            : `<img src="${path}" alt="${alt || ''}" style="display: block; width: 100%; height: auto;" />`
        }
      </div>
    </div>
  `;
};
  const leadDesignerHTML = `
    <div
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        align-items: center;
        margin-top: 18px;
      "
    >
      <ul
        class="contributions-list"
        style="margin: 0; padding-left: 20px;"
      >
        <li>
          Served as
          <strong class="${colorClass}">Lead Designer</strong>
          for <em>Unstrung</em>, a 2.5D narrative puzzle game developed as a Master's Thesis project and released on <strong class="${colorClass}">Steam</strong>.
        </li>

        <li>
          Led the game's
          <strong class="${colorClass}">gameplay and design direction</strong>,
          working across puzzle design, level design, progression, narrative implementation, and player experience.
        </li>

        <li>
          Collaborated with the narrative, programming, art, and development teams to translate the project's creative vision into cohesive gameplay and interactive experiences.
        </li>

        <li>
          Designed and iterated on gameplay systems and level experiences while maintaining consistency between the game's narrative structure, mechanics, and progression.
        </li>
      </ul>

      <div
        style="
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        "
      >
        <img
          src="${data.images?.team || 'assets/Unstrung/equipo.png'}"
          alt="Unstrung Development Team"
          style="
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
          "
        />
      </div>
    </div>
  `;

  const toolDesignHTML = `
  <div
    class="unstrung-process-grid"
    style="
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
      margin-top: 26px;
      margin-bottom: 34px;
    "
  >
    <div
      class="unstrung-process-card"
      style="
        padding: 24px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.08);
        border-top: 3px solid rgba(255, 165, 0, 0.75);
        background: rgba(255,255,255,0.025);
      "
    >
      <div
        class="${colorClass}"
        style="
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        "
      >
        PROBLEM
      </div>

      <p style="margin: 0;">
        The project already had a functional narrator system implemented by a programmer, but its workflow was primarily <strong class="${colorClass}">programmer-oriented</strong>. Narrative content was represented through a large number of individual <strong class="${colorClass}">Data Assets</strong> containing audio and subtitle information. As the amount of dialogue increased, manually creating, configuring, and assigning these assets became a repetitive and time-consuming process for the narrative and design teams.
      </p>
    </div>

    <div
      class="unstrung-process-card"
      style="
        padding: 24px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.08);
        border-top: 3px solid rgba(255, 165, 0, 0.75);
        background: rgba(255,255,255,0.025);
      "
    >
      <div
        class="${colorClass}"
        style="
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        "
      >
        NEED
      </div>

      <p style="margin: 0;">
        A more accessible production workflow was required so that designers and narrative designers could manage large amounts of dialogue content without having to manually create and configure each Data Asset. The system also needed to preserve the existing runtime architecture and integrate with the different types of narrative events defined by the narrative lead.
      </p>
    </div>
  </div>

  <div style="margin-top: 10px; margin-bottom: 18px;">
    <div
      class="${colorClass}"
      style="
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.08em;
        margin-bottom: 16px;
      "
    >
      SOLUTION
    </div>

    <p style="margin-bottom: 22px;">
      Designed and implemented a <strong class="${colorClass}">designer-friendly narrator authoring tool in Unreal Engine</strong> using an Editor Utility Widget and Blueprint-based systems.
    </p>
  </div>

  <ul class="contributions-list" style="margin-top: 0;">
    <li>
      Designed a unified <strong class="${colorClass}">LevelNarratorEvent</strong> data structure based on the event types and requirements defined by the Lead Narrative Designer.
    </li>
    <li>
      Developed the <strong class="${colorClass}">EUW_NarratorGenerator</strong> Editor Utility Widget to automate the creation and configuration of narrator Data Assets.
    </li>
    <li>
      Implemented a <strong class="${colorClass}">JSON-driven import pipeline</strong> capable of reading dialogue metadata and subtitle information and automatically generating the corresponding narrator assets.
    </li>
    <li>
      Automated the association of <strong class="${colorClass}">audio files, dialogue IDs, subtitles, and event information</strong>, replacing a manual asset-by-asset workflow.
    </li>
    <li>
      Structured generated assets by level and dialogue identifier, providing a predictable and scalable content pipeline.
    </li>
    <li>
      Integrated the tool with the existing <strong class="${colorClass}">Narrator Subsystem</strong>, allowing the generated assets to be consumed directly by the game's runtime narrator system.
    </li>
    <li>
      Supported the existing narrative architecture, including <strong class="${colorClass}">dialogue events, branching events, triggers, interactable events, priorities, and subtitle presentation</strong>.
    </li>
  </ul>
`;

  return `
    <div class="unstrung-project" style="width: 100%; max-width: 1100px; margin: 0 auto; font-family: inherit;">

      <!-- MEDIA CAROUSEL -->
      <div class="carousel-container" style="margin-bottom: 55px;">
        ${
          mediaList.length > 1
            ? `<button class="carousel-btn prev" onclick="moveCarousel(-1)">&#10094;</button>`
            : ''
        }

        <div class="carousel-media-wrapper">
          ${
            mediaList.length
              ? slidesHTML
              : `<div class="carousel-slide active"><div style="padding: 90px 20px; text-align: center; opacity: 0.45;">No media available.</div></div>`
          }
        </div>

        ${
          mediaList.length > 1
            ? `<button class="carousel-btn next" onclick="moveCarousel(1)">&#10095;</button>`
            : ''
        }

        <div class="carousel-description-wrapper">
          ${textsHTML}
        </div>
      </div>

      <!-- PROJECT OVERVIEW / METADATA -->
      <div class="project-top-grid" style="margin-bottom: 65px;">
        <!-- PROJECT OVERVIEW -->
        <div class="details-col">
          <h4 class="section-title ${colorClass}">Project Overview</h4>

          <div class="overview-content">
            <p>
              <strong class="${colorClass}">Unstrung</strong> is a <strong class="${colorClass}">2.5D narrative puzzle game</strong> developed as a Master's Thesis project, set within a dark puppet theatre and inspired by a reinterpretation of <em>Hansel and Gretel</em>. The game combines narrative-driven exploration with environmental puzzles and a distinctive theatrical presentation.
            </p>
            <br>
            <p>
              As <strong class="${colorClass}">Lead Designer</strong>, I was responsible for guiding the game's <strong class="${colorClass}">design direction and gameplay experience</strong>, working closely with the multidisciplinary development team to translate the project's creative vision into coherent gameplay systems, puzzles, progression, and player experience.
            </p>
            <br>
            <p>
              The project resulted in a <strong class="${colorClass}">fully playable commercial-quality game released on Steam</strong>, developed under <strong class="${colorClass}">Black Hat Studio</strong> and published by <strong class="${colorClass}">U-tad and Black Hat Studio</strong>.
            </p>
          </div>
        </div>

        <!-- METADATA -->
        <div class="details-col">
          <h4 class="section-title ${colorClass}">Metadata</h4>

          <div class="metadata-list">
            <div>
              <strong>Technologies:</strong> UE5, Visual Studio 2022, FMOD, Github.
            </div>

            <div>
              <strong>Role:</strong> Lead Designer and Tool Designer
            </div>

            <div>
              <strong>Team Size:</strong> ~40 Members - Master's Thesis Project
            </div>

            <div>
              <strong>Duration:</strong> 6 Months
            </div>

            <div>
              <strong>Genre:</strong> 2.5D Narrative Puzzle Game
            </div>

            <!-- BOTONES EN METADATA -->
            ${renderActionButtons()}
          </div>
        </div>
      </div>

      <!-- PERSONAL CONTRIBUTIONS -->
      <div class="details-col personal-contributions-section" style="margin-bottom: 65px;">
        <h4 class="section-title ${colorClass}">Personal Contributions</h4>

        <div class="contribution-section" style="margin-top: 32px;">
          <h5 class="section-subtitle ${colorClass}" style="font-size: 1.2rem; margin-bottom: 12px;">
            1. Lead Designer
          </h5>
          ${leadDesignerHTML}
        </div>

        ${inlineImage(data.images?.leadDesigner, 'Unstrung - Lead Designer')}

        <div class="contribution-section" style="margin-top: 10px;">
          <h5 class="section-subtitle ${colorClass}" style="font-size: 1.2rem; margin-bottom: 12px;">
            2. Tool Designer &amp; Narrative Pipeline
          </h5>
          ${toolDesignHTML}
        </div>

        ${inlineImage(data.images?.toolsPipeline, 'Unstrung - Designer Tools & Narrative Pipeline')}
      </div>

      <!-- BOTONES DE ACCIÓN AL FINAL -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; margin-top: 40px;">
        ${renderActionButtons()}
      </div>

    </div>
  `;
}

/* =========================================================
   3 MAIN PROJECTS
   ========================================================= */

const mainProjectsData = {


  /* =======================================================
     PROJECT 1 — LLM REACTIVE ENVIRONMENTS
     ======================================================= */

  1: {

    title:
      "LLM-Driven Reactive Environments in UE5",

    status:
      "COMPLETED",

    desc:
      "An experimental Unreal Engine 5 system integrating local Large Language Models to dynamically alter environment layout, mechanics, and narrative in real time.",

    engine:
      "UE 5.2.1 / Blueprints & Python",

    role:
      "Core Developer & Researcher",

    genre:
      "Tech Demo / AI Systems Tooling",

    cardImage:
      "assets/TFG/Capsula.png",

    colorClass:
      "title-green",


    get fullDetails() {

      return getProjectTemplate({

        media: {

          slide1: {
            type: "video",
            src: "assets/TFG/tfgVideo.mp4",
            alt: "Level Design",
            title: "Environment - Level Design",
            desc:
              "Overview of the test environment: a fictional prison complex split into the cell block and the main wing, connected by a code-locked electronic door. It showcases the level design and the two available escape routes designed for the player."
          },

          slide2: {
            src: "assets/TFG/1.png",
            alt: "Environment Capture 1",
            title: "Environment Interaction",
            desc:
              "Intermediate checkpoint door separating the cell block from the main wing. Features the interactive keypad UI and highlights alternative resolution methods like short-circuiting or code input."
          },

          slide3: {
            src: "assets/TFG/2.png",
            alt: "Environment Capture 2",
            title: "Player's Cell Door",
            desc:
              "Main initial obstacle highlighting the interactable cell door and its status UI. Demonstrates multiple interaction mechanics, including keys, lock picking, or forcing the lock."
          },

          slide4: {
            src: "assets/TFG/3.png",
            alt: "Environment Capture 3",
            title: "Damaged Tunnel Wall",
            desc:
              "Interactive environment obstacle showing object highlighting and UI info panel. Represents an alternative progression path where players can breach the weakened structure using heavy items."
          },

          slide5: {
            src: "assets/TFG/6.png",
            alt: "Environment Capture 5",
            title: "Main Wing Common Area",
            desc:
              "Shows the administrative and waiting area of the correctional facility, including vending machines, a water dispenser, office furniture, seating area, and the reinforced vault door in the background."
          },

          slide6: {
            src: "assets/TFG/7.png",
            alt: "Environment Capture 6",
            title: "Cell Block Area",
            desc:
              "View of the cell block enclosed by metal bars, showcasing the player's cell, the surveillance system, and lighting within the confinement area."
          },

          slide7: {
            src: "assets/TFG/5.png",
            alt: "Environment Capture 7",
            title: "Guard Lobby and Storage",
            desc:
              "Side perspective of the common area featuring supply shelving, maintenance tools, and guards patrolling the access zone near the cells."
          },

          slide8: {
            src: "assets/TFG/9.png",
            alt: "Environment Capture 8",
            title: "Interactable Weapon Object",
            desc:
              "Highlights an interactable environment item showing its outline and UI information panel. Represents an inventory tool requiring specific ammunition to become operational."
          }

        },


        overviewParagraphs: [

          'This work explores the integration of <span class="title-green">large language models (LLMs)</span> in video games to generate reactive environments and narratives based on player actions. The main goal was to design and implement a system capable of interpreting interactions with objects or non-player characters (NPCs) and generating structured responses that dynamically modify the game world. The tool, developed in <span class="title-green">Unreal Engine 5.2.1</span>, is connected to an LLM through a communication system built in Python.<br><br>',
          
          'During development, techniques such as <span class="title-green">Retrieval Augmented Generation (RAG)</span> and <span class="title-green">Reflexion</span> were evaluated, but ultimately discarded due to high computational cost, low feasibility, and increased latency. A user test was conducted to evaluate both the coherence of the model\'s responses and the immersion experience.<br><br>',

          'This project demonstrates the potential of LLMs to democratize the design of reactively complex video games, even in resource-constrained environments.'

        ],


        meta: {

          engine:
            "UE 5.2.1 / Blueprints & Python",

          role:
            "Core Developer & Researcher",

          team:
            "5 Members",

          duration:
            "9 Months (Sep - May)",

          grade:
            "Honors",

          thesisPdf:
            "assets/Memoria_TFG.pdf",

          repo:
            "https://github.com/NILGroup/TFG-2425-InteractionLLM",

          keywords:
            "LLM, Generative AI, Prompt Engineering, Unreal Engine, Reactivity"

        },


        middleImageSrc:
          "assets/TFG/tfgVideo2.mp4",


        contributions: [

          {
            title:
              "Environment Interaction Mechanics",

            desc:
              " Designed and implemented Blueprint systems for real-time creation, modification, and destruction of dynamic 3D objects driven by natural language input."
          },

          {
            title:
              "Spatial & Relative Instantiation",

            desc:
              " Developed placement logic allowing newly generated objects to spawn relative to target actors with contextual properties such as shapes, descriptions, and behaviors."
          },

          {
            title:
              "JSON Parsing & Data Pipelines",

            desc:
              " Researched Unreal Engine plugins to build efficient JSON deserialization pipelines, translating structured LLM outputs directly into gameplay actions."
          },

          {
            title:
              "Input Routing",

            desc:
              " Integrated player interaction detection for objects and NPCs to format and pass contextual game state data to the core PromptManager."
          },

          {
            title:
              "LLM Research & Prompt Engineering",

            desc:
              " Conducted comparative evaluation tests across local LLMs (LLaMA 3.1, Granite 3.2, and OLMo) and prototyped a self-correcting reflection mechanism."
          },

          {
            title:
              "Documentation & User Testing",

            desc:
              " Authored thesis chapters on the semantic interaction system, communication protocols, and LLM research."
          }

        ]

      }, this.colorClass);

    }

  },


  /* =======================================================
     PROJECT 2 — EDEN
     ======================================================= */

 2: {
  title: "Unstrung",
  status: "IN PROGRESS",

  desc:
    "A 2.5D narrative puzzle game developed as a Master's Thesis project, combining theatrical exploration, environmental puzzles, and a designer-focused narrative content pipeline.",

  engine:
    "UE5 / Visual Studio 2022 / FMOD / Github",

  role:
    "Lead Designer and Tool Designer",

  genre:
    "2.5D Narrative Puzzle Game",

  cardImage: "assets/Unstrung/UnstrungCapsula.png",

  colorClass: "title-orange",

  media: {

          slide1: {
            type: "video",
            src: "assets/Unstrung/Trailer.mp4",
            alt: "Level Design",
            title: "Trailer",
            desc:
              ""
          },

          slide2: {
            src: "assets/Unstrung/SteamView.png",
            alt: "Environment Capture 1",
            title: "Steam Page",
            desc:
              ""
          },

          slide3: {
             src: "assets/Unstrung/guerrilla.jpeg",
            alt: "Environment Capture 1",
            title: "GUERRILLA FESTIVAL 2026",
            desc:
              "We won the BEST NARRATIVE GAME award at the GUERRILLA FESTIVAL 2026"
          },

          slide4: {
            src: "assets/Unstrung/UTADPerfil.jpeg",
            alt: "Environment Capture 3",
            title: "U-TAD Pitches",
            desc:
              "Served as the main presenter and face of the project, pitching and presenting progress reports to stakeholders during key milestones (Alpha, Beta, and Gold)."
          },

          slide5: {
            src: "assets/Unstrung/Gameplay_4.png",
            alt: "Environment Capture 5",
            title: "Visual Identity",
            desc:
              "Definition of the game's unique visual identity and aesthetic direction, seamlessly blending 3D environmental depth with 2D theatrical craft. The art style leverages dramatic stage lighting, cutout-inspired set pieces, and a gloomy color palette to reinforce the eerie, puppet-theatre atmosphere essential to the core experience."
          }

        },

  images: {
    team: 'assets/Unstrung/equipo.png',
    /*
     * Imagen que aparece ENTRE:
     * 1. Lead Designer
     * y
     * 2. Designer Tools & Narrative Pipeline
     */
    leadDesigner:"",

    /*
     * Imagen que aparece AL FINAL de:
     * 2. Designer Tools & Narrative Pipeline
     */
    toolsPipeline:{
    src: 'assets/Unstrung/narrador.mp4'
  }
  },

  get fullDetails() {
    return getUnstrungTemplate({
      media: this.media,

      images: this.images,

      resources: {
        steam: "https://store.steampowered.com/app/5094810/Unstrung/?l=english",
        linkedin: "https://es.linkedin.com/in/unstrung-game-8384313b9"
      }
    }, this.colorClass);
  }
}, 
3: {

    title:
      "EDEN – 3D Data-Driven Game Engine",

    status:
      "COMPLETED",

    desc:
      "A modular, data-driven 3D game engine developed in C++, with contributions focused on the rendering subsystem and Blender-based scene authoring pipeline.",

    engine:
      "C++ / OGRE/OpenGL / Bullet3D / Lua / Python / Blender",

    role:
      "Rendering & Tools Developer",

    genre:
      "3D Game Engine",

    cardImage:
      "assets/EDEN/EDENCapsula.png",

    colorClass:
      "title-purple",


    get fullDetails() {

      return getProjectTemplate({

        media: {

          slide1: {

            src:
              "assets/EDEN/info.png",

            alt:
              "EDEN Rendering Architecture",

            title:
              "EDEN Architecture",

            desc:
              "3D game engine integrating OGRE 3D for rendering, Bullet for physics simulation, irrKlang for spatial audio, SDL for windowing/input handling, and Lua for dynamic scripting."

          },


          slide2: {

            src:
              "assets/EDEN/CrossThePath.mp4",

            alt:
              "Blender Scene Pipeline",

            title:
              "Cross the Path",

            desc:
              "A game created with EDEN as its engine."

          }, 
           slide3: {

            src:
              "assets/EDEN/Damn.mp4",

            alt:
              "Blender Scene Pipeline",

            title:
              "DAMN",

            desc:
              "A game created with EDEN as its engine."

          }

        },


        overviewParagraphs: [

          '<span class="title-purple">EDEN</span> is a modular, data-driven 3D game engine developed in <span class="title-purple">C++</span>. It was developed as a team project using an entity-component architecture and integrated multiple subsystems including rendering, physics, audio, input, UI and scripting.',

          '<br>My contribution focused specifically on the <span class="title-purple">rendering subsystem</span> and the <span class="title-purple">Blender/Python scene authoring pipeline</span>. I developed EDEN_Render as a higher-level abstraction over OGRE, providing reusable components for meshes, cameras, lighting, skeletal animation, particles, scene nodes and UI.',

          '<br>In parallel, I developed the Blender scene pipeline using Python. The tool extracts object transforms, mesh information, dimensions and CustomProperties from Blender scenes and converts them into engine-compatible data, reducing the need to manually define environments through Lua.',

          '<br>The resulting workflow was then used to develop <span class="title-purple">Cross The Path</span>, a complete 3D game built on top of the EDEN engine and integrating its rendering, physics, input, audio, UI and scripting systems.'

        ],


        meta: {

          engine:
            "C++ / OGRE/OpenGL / Bullet3D / Lua / Python / Blender",

          role:
            "Rendering & Tools Developer",

          team:
            "11 Members",

          duration:
            "4 Months",

          repo:
            "https://github.com/UCM-FDI-DISIA/EDEN",

          keywords:
            "C++, 3D Game Engine Development, Entity-Component Architecture, OGRE/OpenGL, Bullet3D, Lua, Blender, Python"

        },


        middleImageSrc:
          "",


        contributions: [

          {
            title:
              "EDEN_Render",

            desc:
              " Developed the rendering abstraction layer over OGRE, exposing a cleaner interface between the engine and the underlying rendering library."
          },

          {
            title:
              "Rendering Components",

            desc:
              " Implemented and integrated core rendering components including RenderManager, RenderObject, MeshRenderer, CameraWrapper, Light, Animator, ParticleSystem, NodeManager and Canvas."
          },

          {
            title:
              "Blender Scene Pipeline",

            desc:
              " Developed the Python-based BlenderSceneParser pipeline to extract scene geometry, transforms, dimensions and CustomProperties from Blender-authored environments."
          },

          {
            title:
              "3D Level Authoring Workflow",

            desc:
              " Streamlined the creation of 3D environments by allowing levels to be authored in Blender and converted into engine-compatible scene data."
          },

          {
            title:
              "Cross The Path",

            desc:
              " Developed Cross The Path as a complete 3D game built on top of EDEN, integrating the engine's rendering, physics, input, audio, UI and scripting systems."
          },

          {
            title:
              "Technology Stack",

            desc:
              " Worked with C++, OGRE/OpenGL, Bullet3D, Lua, Python and Blender within a modular data-driven game-engine architecture."
          }

        ]

      }, this.colorClass);

    }

  }

};


/* =========================================================
   SECONDARY PROJECTS
   ========================================================= */

const secondaryProjectsData = {

  'vuaj': {
  id: "vuaj",
  title: "Vision Unity Accessibility Junction",
  category: "programming",
  subcategory: "tools",
  tag: "UNITY / C#",
  engine: "Unity 2022.3 LTS (C#)",
  duration: "Academic Project",
  role: "Settings & Tool Developer",
  tags: ["Unity", "Accessibility", "UI Automation", "C#"],
  colorClass: "title-blue",

  get fullDetails() {
    return getProjectTemplate({
      media: {
        slide1: {
          src: "assets/VUAJ.png", // Ajusta la ruta de tu imagen o vídeo
          title: "Vision Unity Accessibility Junction",
          desc: "A modular visual accessibility framework developed in Unity 2D."
        },
        slide2: {
          src: "assets/vUAJ.mp4", // Ajusta la ruta de tu imagen o vídeo
          title: "Demo",
          desc: ""
        }
      },
     overviewParagraphs: [
      '<strong>Vision Unity Accessibility Junction (vUAJ)</strong> is a tool designed to streamline the integration of visual accessibility features into games developed with Unity 2D, based on the guidelines set out in the <em>Game Accessibility White Paper</em>. Its primary objective is to enhance the gameplay experience for players with visual impairments.',
      
      '<p style="margin-top: 15px; margin-bottom: 10px;">Key features of the framework include:</p>',
      
      `<ul class="contributions-list">
        <li><strong class="${this.colorClass}">Customizable HUD:</strong> Players can adjust the position, size, and drop shadows of HUD elements to suit their visual preferences.</li>
        <li><strong class="${this.colorClass}">Audio Description (TTS):</strong> Built-in Text-To-Speech functionality reads in-game elements and subtitles aloud to assist with comprehension.</li>
        <li><strong class="${this.colorClass}">Screen Magnifier:</strong> Allows zooming in on any area of the screen to improve visibility of detailed game elements.</li>
        <li><strong class="${this.colorClass}">Customizable Notifications:</strong> A comprehensive notification system that enables users to adjust position, size, duration, and visual styles. Developers can fully customize notification colors, icons, text, audio cues, and haptic feedback.</li>
        <li><strong class="${this.colorClass}">Alternative Typography:</strong> Supports switching the game font to dyslexia-friendly typefaces for improved readability.</li>
        <li><strong class="${this.colorClass}">Text Scaling:</strong> Includes options to scale up text sizes throughout the UI and game world for easier reading.</li>
        <li><strong class="${this.colorClass}">Volume Perception:</strong> Outlines the collision boundaries of interactable objects to aid in environmental navigation and item discovery.</li>
      </ul>`
    ],
      meta: {
        engine: "Unity 2022.3 LTS (C#)",
        role: "Settings & Tool Developer",
        team: "5 members",
        duration: "1 month - Academic Project",
        repo: "https://github.com/DavidRainder/vUAJ",
        reportPdf: "assets/VUAJ.pdf",
        keywords: "Unity, Accessibility, UI Automation, C#"
      },

       middleImageSrc:
          "assets/HerramientasVUAJ.png",

      contributions: [
        {
          title: "Settings Scene Integration",
          desc: " Designed and implemented the core Settings scene, orchestrating the merger of all individual feature canvases required for configuring and demonstrating every accessibility tool in runtime."
        },
        {
          title: "Customizable Notification System",
          desc: " Developed the entire Notification module (including NotificationManager, NotificationUI, and NotificationAssetLibrary)."
        },
        {
          title: "InputRebinderUI System",
          desc: " Created an in-game input rebinding user interface that enables players to reconfigure action keys dynamically."
        }
      ]
    }, this.colorClass);
  }
},

'unstrung-tool': {
  id: "unstrung-tool",
  title: "Unstrung – Narrative Tool & Pipeline",
  get fullDetails() {
    return mainProjectsData[2].fullDetails;
  }
},
'ott-journey': {
  title: "Ott: An Elemental Journey",
  itchUrl: "https://davidrainder.itch.io/ott-an-elemental-journey",
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/Ott/OttAnElementalJourney.mp4",
        title: "Ott: An Elemental Journey",
        desc: ""
      },
       slide2: {
        src: "assets/Ott/mainMenu.png",
        title: "Main Menu",
        desc: ""
      },
       slide3: {
         src: "assets/Ott/paletterEarth.png",
        title: "Earth Level ",
        desc: ""
      },
       slide4: {
         src: "assets/Ott/darkenedScreen.png",
        title: "Earth Level - Part 2",
        desc: ""
      },
       slide5: {
        src: "assets/Ott/paletteFire.png",
        title: "Fire Level",
        desc: ""
      },
       slide6: {
        src: "assets/Ott/paletteWater.png",
        title: "Water Level",
        desc: ""
      }
    },

    overviewParagraphs: [
      'A 2D fantasy Metroidvania adventure game built entirely with <span class="title-blue">SDL and C++</span> over 4 months of development by an 11-participant team at Fae Studios.',
      '<br>In the game, Ott journeys through elemental regions (Earth, Water, and Fire), gains new abilities, and fights corruption to restore light to his homeland.',
      '<br>As Ott unlocks elemental powers, players gain new movement, combat, and puzzle-solving mechanics that allow them to backtrack, access previously locked areas, and discover hidden secrets throughout the world.'
    ],

    meta: {
      engine: "C++ / Custom Engine (SDL) / Tiled",
      role: "Game Designer & C++ Programmer",
      team: "11 Participants (Fae Studios / UCM)",
      duration: "4 Months",
      repo: "https://github.com/UCM-FDI-DISIA/Fae-Studios/tree/main",
      itchio: "https://davidrainder.itch.io/ott-an-elemental-journey",
      keywords: "C++, SDL, Metroidvania, 2D Platformer, Tiled Integration, Level Design, Mechanics Design"
    },

    middleImageSrc: "",

    contributions: [
      {
        title: "Design & QA Testing (Earth & Fire Worlds)",
        desc: "Designed the layout, flow, pacing, and difficulty curve for both the Earth (Forest) and Fire (Volcano) realms. Conducted comprehensive Quality Assurance (QA) testing to refine level mechanics, enemy placement, and user navigation."
      },
      {
        title: "General Game Dynamics, Narrative & Mechanics",
        desc: "Co-designed core gameplay systems including the elemental rock-paper-scissors hierarchy, player movement abilities (vine climbing, diving, teleportation), health/shield systems, and overall narrative progression."
      },
      {
        title: "Artistic Direction",
        desc: "Defined the overall 2D Pixel Art visual style, establishing distinct color palettes for each elemental kingdom (Earth, Water, Fire, and Darkness) and guiding character/environment aesthetic consistency."
      },
      {
        title: "Final Earth Boss Design",
        desc: "Designed the mechanics, attack patterns, vertical arena interaction, and phase progression for the Earth Kingdom Boss (Giant Worm)."
      },
      {
        title: "Map Implementation via Tiled & C++/SDL",
        desc: "Designed 2D tilemaps using Tiled Map Editor and programmed their parsing and integration directly into our custom C++ and SDL engine."
      }
    ]
  }, 'title-blue')
},

'hundred-town': {
  title: "The HundredTown",
  itchUrl: null, // Cambiar si cuenta con enlace a itch.io
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/NowARTS/1.mp4",
        title: "The HundredTown Overview",
        desc: ""
      },
      slide2: {
        src: "assets/NowARTS/2.mp4",
        title: "Nighttime Campus View",
        desc: ""
      },
      slide3: {
        src: "assets/NowARTS/5.png",
        title: "Seasonal Events",
        desc: ""
      }
    },

    overviewParagraphs: [
      'An interactive, real-time 3D experience designed to showcase a fictional campus celebrating the history and iconic venues of the hamburger chain <span class="title-blue">HUNDRED</span>.',
      '<br>Inspired by TeamLab’s interactive artwork <i>The World of Irreversible Change</i>, the environment updates dynamically every 15 minutes to match local real-world weather conditions, seasonal lighting cycles, and festive holiday themes.',
      '<br>The project integrates atmospheric particle systems, dynamic lighting routines, custom camera post-processing, and interactive minigames designed to drive user engagement.'
    ],

    meta: {
      engine: "Unity / C#",
      role: "Design & Implementation Developer (Internship)",
      team: "Multidisciplinary Team (NowAR Lab)",
      duration: "Internship Period ~ 3 months",
      repo: null, // Insertar enlace de repositorio si aplica
      itchio: null, // Insertar enlace de itch.io si aplica
      reportPdf: "assets/NowARTS/memoria.pdf", // Ruta a tu documento de memoria en PDF
      keywords: "Unity, C#, COZY Weather 3, OpenWeatherMap API, Lightmap Baking, Post-Processing, Dynamic Lighting"
    },

    middleImageSrc: "",

    contributions: [
      {
        title: "Weather & Solar API Integration",
        desc: "Designed and implemented a modular, decoupled architecture (IWeatherProvider, IWeatherData, ServerProvider) in C# to fetch real-time atmospheric data and sun cycle times. Transmitted live data from external services (transitioning from Tomorrow.io to OpenWeatherMap) directly into Unity."
      },
      {
        title: "Weather & Environment System Setup (COZY 3)",
        desc: "Integrated and configured the COZY: Stylized Weather 3 asset within Unity. Built dedicated system managers (SunCycleManager, WeatherManager, ChangeLocationManager) to synchronize real-time day/night cycles, smooth weather transitions, and automated city lighting behaviors."
      },
      {
        title: "Scene Lighting & Asset Optimization",
        desc: "Handled materials, shaders, and illumination setups for approximately 15 unique building structures across the campus. Optimized overall scene performance by establishing precomputed daytime and nighttime baked lightmaps and implementing the Lightmap Switching Tool to allow smooth runtime switching without rebaking overhead."
      },
      {
        title: "Dynamic Night Life Scripting",
        desc: "Developed custom C# scripts for emissive window textures to simulate realistic night behavior—randomizing active warm and cool light profiles for upper residential windows while maintaining steady illuminated storefronts for restaurants and commercial locations."
      },
      {
        title: "Post-Processing & Visual Styling",
        desc: "Evaluated and benchmarked multiple camera filters to match the project's comic/stylized art direction, selecting a high-contrast, saturated 'Spider-Verse' inspired post-processing profile."
      },
      {
        title: "Web Interactivity & Event Decorator",
        desc: "Integrated web-to-Unity message handlers to enable manual environment overrides via external web/mobile control interfaces during client demonstrations. Built an automated event system to instantiate thematic decorations (such as Halloween and Christmas assets) based on active calendar dates."
      }
    ]
  }, 'title-blue')
},

'a-different-vision': {
  title: "A Different Vision: A Color Blindness Experience",
  itchUrl: null, // Insertar enlace de itch.io si aplica
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/Vision/Vis.png",
        title: "A Different Vision",
        desc: ""
      },
      slide2: {
        src: "assets/Vision/Vision.mp4",
        title: "A Different Vision Overview",
        desc: ""
      },
      slide3: {
        src: "assets/Vision/daltonism.png",
        title: "Types of Daltonism",
        desc: ""
      },
      slide4: {
        src: "assets/Vision/explain.png",
        title: "Explanatory Room",
        desc: ""
      }
    },

    overviewParagraphs: [
      'A Virtual Reality (Meta Quest) educational simulation built with <span class="title-blue">Unity</span> over 2 weeks of development by a 4-participant team at Universidad Complutense de Madrid.',
      '<br>The experience lets players explore school environments through the eyes of a color-blind child, highlighting everyday challenges hidden in a color-dependent learning environment.',
      '<br>Players navigate a playground and classrooms with various color-blindness visual filters (deuteranopia, protanopia, tritanopia, and achromatopsia) before reaching an informative exhibition room with interactive color vision controls.'
    ],

    meta: {
      engine: "Unity / C# / XR Interaction Toolkit",
      role: "VR Programmer & Environment Designer",
      team: "4 Participants (UCM)",
      duration: "2 Weeks",
      repo: "https://github.com/nahigles/EIRV_VR_UnityFinalProject", // Insertar enlace de repositorio si aplica
      itchio: null, // Insertar enlace de itch.io si aplica
      reportPdf: "assets/Vision/Memoria.pdf", // Ruta a tu documento de memoria en PDF
      keywords: "Unity, VR, C#, Meta Quest, XR Interaction Toolkit, Color Blindness Simulation, Lighting, Interactive UI"
    },

    middleImageSrc: "",

    contributions: [
      {
        title: "Explanatory Exhibition Room Logic & UI Interaction",
        desc: "Designed and implemented the functionality, animations, text displays, and interactive elements of the final exhibition room. Integrated XR Simple Interactable and XR Poke Filter components to build tactile buttons that dynamically switch the active color blindness filter during runtime."
      },
      {
        title: "School Courtyard Environment Design",
        desc: "Sourced assets and decorated the interactive outdoor playground, setting up the initial starting zone and atmospheric layout for the experience."
      },
      {
        title: "Scene Lighting Setup",
        desc: "Configured and calibrated the complete scene illumination, including Light Probes, Spotlights, Point Lights, and Directional Lighting to create realistic depth and visual clarity across all interior and exterior spaces."
      },
      {
        title: "Player Collision & XR Physics Integration",
        desc: "Implemented physical player collision setups for the virtual player avatar within Unity's XR framework to ensure smooth locomotion and proper spatial bounds throughout the school grounds."
      }
    ]
  }, 'title-blue')
},
'geoguide': {
  title: "GeoGuide",
  itchUrl: null, // Insertar enlace de itch.io si aplica
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/GeoGuide/videoplayback.mp4",
        title: "GeoGuide Overview",
        desc: ""
      },
      slide2: {
        src: "assets/GeoGuide/hud_partida.png",
        title: "In-Game Flying & HUD",
        desc: ""
      },
      slide3: {
        src: "assets/GeoGuide/menu_tarjetas.png",
        title: "Collectible Info Cards",
        desc: ""
      },
      slide4: {
        src: "assets/GeoGuide/menu_niveles.png",
        title: "Levels",
        desc: ""
      }
    },

    overviewParagraphs: [
      'A casual educational simulation game built with <span class="title-blue">Unity</span> over 4 months of development by a 3-participant team.',
      '<br>Designed to teach world geography to children aged 8–15 through positive reinforcement and association rather than simple rote memorization.',
      '<br>Players pilot an aircraft transporting clients to destinations across continents, unlocking collectible country cards, reading engaging facts, and utilizing dynamic gameplay hints to avoid frustration.'
    ],

    meta: {
      engine: "Unity / C#",
      role: "UI Developer, Save System & Gameplay Programmer",
      team: "3 Participants",
      duration: "4 Months",
      repo: "https://github.com/almasso/geoguide", // Insertar enlace de repositorio si aplica
      itchio: null, // Insertar enlace de itch.io si aplica
      reportPdf: "assets/GeoGuide/GeoGuide.pdf", // Ruta al documento de memoria de GeoGuide
      keywords: "Unity, C#, UI Navigation, Save System, Progress Tracking, Hint System, Serious Game"
    },

    middleImageSrc: "assets/GeoGuide/geoguideTitulo.png",

    contributions: [
      {
        title: "Main Menu & Level Selection Navigation",
        desc: "Designed and implemented the core UI navigation framework, including the main menu flow, continent-based level selection, and dynamic UI responsiveness."
      },
      {
        title: "Save System & Progress Tracking",
        desc: "Developed the full data persistence system using C# to track player progress, unlocked levels, star achievements (1–3 stars), and collected country info cards across play sessions."
      },
      {
        title: "Client Interaction & Timed Hint System",
        desc: "Programmed the interactive client dialogue logic and the in-game timed hint system to assist lost players and ensure an accessible learning experience."
      }
    ]
  }, 'title-blue')
},

'wildlife-simulator': {
  title: "Wildlife Simulator",
  itchUrl: null, // Insertar enlace de itch.io si aplica
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/WildLife/PartidaCompleta.mp4",
        title: "Full Gameplay Showcase",
        desc: "Complete simulation walkthrough showing animal AI interactions"
      },
      slide2: {
        src: "assets/WildLife/Prueba-EscenarioGeneracionYPerlin.mp4",
        title: "Procedural Generation & Perlin Noise",
        desc: "Demonstration of procedural wildlife generation using Perlin Noise"
      },
      slide3: {
        src: "assets/WildLife/Prueba-PreferenciaDeCiervoAConejo.mp4",
        title: "Carnivore Prey Preference Test",
        desc: "AI test showcasing predator preference logic (Deer vs Rabbit)"
      },
      slide4: {
        src: "assets/WildLife/Prueba-PerdidaDeRastro.mp4",
        title: "Scent Trail Loss Mechanics",
        desc: "Demonstration of carnivores tracking and losing scent trails dynamically"
      },
      slide5: {
        src: "assets/WildLife/Prueba-PreferenciaHambreASueño.mp4",
        title: "Behavior Tree Priority Test",
        desc: "FSM and Behavior Tree prioritization between Hunger and Sleep states"
      },
      slide6: {
        src: "assets/WildLife/Prueba-EleccionDeArbustoMasCercanoDisponible.mp4",
        title: "Herbivore Foraging Logic",
        desc: "Herbivore selecting and navigating to the nearest available bush"
      },
      slide7: {
        src: "assets/WildLife/Prueba-ConejoVSConejoEscojeAlMasCercano.mp4",
        title: "Target Selection Distance Test",
        desc: "Predator targeting algorithm choosing the closest prey target"
      },
      slide8: {
        src: "assets/WildLife/Prueba-SiNoHayArbustosDisponiblesMerodeas.mp4",
        title: "Fallback Behavior Test",
        desc: "Wandering/fallback behaviors when resources (bushes) are exhausted"
      }
    },

    overviewParagraphs: [
      'A wildlife simulation game developed in <span class="title-blue">Unity</span> over 2 weeks by a 2-participant team.',
      '<br>Inspired by natural animal behavior and sensory survival mechanics, set inside procedurally generated environments driven by Perlin noise.',
      '<br>Features an advanced artificial intelligence system combining high-level state management with intricate decision trees and sensory scent tracking for realistic predator-prey dynamics.'
    ],

    meta: {
      engine: "Unity / C# / NavMesh",
      role: "AI Programmer & Systems Developer",
      team: "2 Participants",
      duration: "2 Weeks",
      repo: "https://github.com/ClaudiaZarzuela/IAV24-ZarzuelaAmorVegaSaugar",
      itchio: null, // Insertar enlace de itch.io si aplica
      reportPdf: null, // Insertar ruta a PDF si aplica
      keywords: "Unity, C#, AI, FSM, Behavior Trees, NavMesh, Scent Detection, Procedural Scent Trail"
    },

    middleImageSrc: "assets/WildLife/capsula.png",

    contributions: [
      {
        title: "FSM, Behavior Trees & NavMesh Integration",
        desc: "Developed a hybrid AI architecture using a general Finite State Machine (FSM) where states are driven by nested Behavior Trees, utilizing Unity's NavMesh system for autonomous navigation and movement."
      },
      {
        title: "Carnivore Scent Detection System",
        desc: "Implemented custom scent detection mechanics that enable carnivores to dynamically detect, track, and hunt prey based on sensory ranges."
      },
      {
        title: "Intelligent Animal Behavior & Decision-Making",
        desc: "Programmed complex decision-making routines for animal AI, allowing dynamic environmental interactions, survival instincts, and context-aware behavior."
      },
      {
        title: "Procedural Scent Trail Generation",
        desc: "Designed and integrated a procedural scent trail generation system that dynamically drops and fades scent markers across the terrain for predators to follow."
      }
    ]
  }, 'title-blue')
},

'nest-winter-edition': {
  title: "Nest: Winter Edition",
  itchUrl: null, // Insertar enlace de itch.io si aplica
  fullDetails: getProjectTemplate({
    media: {
      slide1: {
        src: "assets/Fisica/1.png",
        title: "Nest: Winter Edition",
        desc: "Main menu"
      },
      slide2: {
        src: "assets/Fisica/2.png",
        title: "Level 1",
        desc: ""
      },
      slide3: {
        src: "assets/Fisica/3.png",
        title: "Level 2",
        desc: ""
      },
      slide4: {
        src: "assets/Fisica/4.png",
        title: "Level 3",
        desc: ""
      },
      slide5: {
        src: "assets/Fisica/5.png",
        title: "Level 4",
        desc: ""
      },
      slide6: {
        src: "assets/Fisica/6.png",
        title: "Level 5",
        desc: ""
      },
      slide7: {
        src: "assets/Fisica/7.png",
        title: "Level 6",
        desc: ""
      }
    },

    overviewParagraphs: [
      'A 3D physics-based strategy puzzle game developed as a solo project in <span class="title-blue">C++</span> utilizing <span class="title-blue">Nvidia PhysX</span> engine integration.',
      '<br>Based on the classic strategy game <i>Nest</i>, this winter edition challenges players to guide a young bird—who cannot fly yet—safely to its nest across snowy and stormy environments without hitting hazardous ground or lethal enemies.',
      '<br>Features custom physics implementations including aerodynamics, buoyancy, whirlwind force generators, particle systems, and raycast-based pointer interactions to click, eliminate obstacles, and transform object shapes.'
    ],

    meta: {
      engine: "C++ / Nvidia PhysX",
      role: "Physics Programmer & Game Developer (Solo)",
      team: "Solo Project",
      duration: "Academic Project",
      repo: "https://github.com/ClaudiaZarzuela/SimulacionFisicaVideojuegos",
      itchio: null, // Insertar enlace de itch.io si aplica
      reportPdf: "assets/Fisica/Informe.pdf", // Ruta a tu PDF de memoria
      keywords: "C++, PhysX, Custom Physics Engine, Aerodynamics, Buoyancy, Drag Force, Particle Systems, Raycast Pointers"
    },

    middleImageSrc: "",

    contributions: [
      {
        title: "Custom Physics Force Generators (Drag, Whirlwind & Buoyancy)",
        desc: "Implemented custom mathematical force generators in C++ including Drag Force for wind fans and blizzards, Whirlwind Force for freezing vortex storms, and Buoyancy Force simulating density-based floating ice cubes in lakes."
      },
      {
        title: "Particle Systems & Environmental Effects",
        desc: "Engineered uniform and Gaussian particle generators for real-time weather effects (snow fall, freezing blizzards) and victory/defeat feedback systems (green and red firework particle explosions)."
      },
      {
        title: "Shape-Shifting & 3D Raycast Pointer Interaction",
        desc: "Designed screen-to-world 3D raycast shooting mechanics (`InteractableObjects`) acting as an in-game mouse pointer to click, remove obstacles, and switch enemy and bird forms between cubes and spheres dynamically."
      },
      {
        title: "PhysX Engine Fine-Tuning & 2D Physics Constraints",
        desc: "Calibrated inelastic materials, collision filtering flags, elevated step time precision, and customized inertia tensors (zeroing X-axis component) within Nvidia PhysX to maintain strict 2D physics plane constraints inside a 3D environment."
      }
    ]
  }, 'title-blue')
},

  'jam-1': {

    title:
      "Tongue Twister: Nos hemos liao",

    fullDetails:
      getProjectTemplate({

        media: {
          slide1: {
          src: "assets/TongueTwitser/Trailer.mp4",
          title: "Tongue Twister Overview",
          desc: ""
          },
          slide2: {
          src: "assets/TongueTwitser/1.png",
          title: "Wedding",
          desc: "Final moment of the game"
          },
          slide3: {
          src: "assets/TongueTwitser/2.png",
          title: "Marvin and Bo",
          desc: "Our players"
          }

        },

overviewParagraphs: [
        'Marvin and Bo, two lizards in love, must overcome a series of challenges while keeping their tongues intertwined. Each player controls one of the characters, and cooperation is essential to solve the puzzles and reach their loving destiny.'
      ],

      meta: {
        engine:
          "Unity",
        role:
          "Game & Level Designer / 2D Artist",
        team:
          "9 Participants",
        duration:
          "3 Days",
        itchio: "https://davidrainder.itch.io/tongue-twister-nos-hemos-liao",
        keywords:
          "Jam, Physics, Local Multiplayer, Co-op, Puzzle"
      },

      middleImageSrc:
        "",

      contributions: [
        {
          title:
            "Game & Level Design",
          desc:
            "Game design, core mechanics, and conceptualization of levels and puzzles."
        },
        {
          title:
            "Level Implementation & Testing",
          desc:
            "Implementation, assembly, and testing of levels within the Unity engine."
        },
        {
          title:
            "Artistic Design",
          desc:
            "Creation and design of artistic sprites for in-game elements."
        }
      ]

    }, 'title-orange')
},
  'jam-2': {
  title:
    "Bubble Party XP",

  fullDetails:
    getProjectTemplate({

      media: {
        slide1: {
          src: "assets/Bubble/BubbleParty.mp4",
          title: "Bubble Party XP Overview",
          desc: ""
        },
        slide2: {
          src: "assets/Bubble/1.png",
          title: "Gameplay",
          desc: "Mobile controller interface and minigames"
        },
        slide3: {
          src: "assets/Bubble/2.png",
          title: "Gameplay",
          desc: "Mobile controller interface and minigames"
        },
        slide4: {
          src: "assets/Bubble/3.png",
          title: "Gameplay",
          desc: "Mobile controller interface and minigames"
        },
        slide5: {
          src: "assets/Bubble/4.png",
          title: "Gameplay",
          desc: "Mobile controller interface and minigames"
        },
        slide6: {
          src: "assets/Bubble/5.png",
          title: "Gameplay",
          desc: "Mobile controller interface and minigames"
        }
      },

      overviewParagraphs: [
        'From the deepest depths of Windows XP shovelware comes Bubble Party XP! Enjoy those nostalgic games you never played, now using your mobile device as a controller. Clean objects, shake soda cans, blow bubbles, and more in Bubble Party XP: Now with Mobile!'
      ],

      meta: {
        engine:
          "Unity",

        role:
          "Game Designer, 2D Artist & Shader Developer",

        team:
          "7 Participants",

        duration:
          "3 Days",

        itchio:
          "https://andrea-18.itch.io/bubble-party-xp-ahora-con-el-mvil",

        keywords:
          "Global Game Jam 2025, Unity, Mobile Controller, Party Game, Shaders"
      },

      middleImageSrc:
        "",

      contributions: [
        {
          title:
            "Game Design & Implementation",
          desc:
            "Game design, level implementation, and testing in Unity."
        },
        {
          title:
            "Artistic Design",
          desc:
            "Artistic design of in-game sprites."
        },
        {
          title:
            "Custom Shader Development",
          desc:
            "Developed a custom shader to simulate cleaning objects pixel by pixel."
        }
      ]

    }, 'title-blue')
},

  'jam-3': {
  title:
    "Mi Enamorado Enmascarado",

  fullDetails:
    getProjectTemplate({

      media: {
        slide1: {
          src: "assets/Enamorado/videoplayback.mp4",
          title: "Mi Enamorado Enmascarado Overview",
          desc: ""
        },
        slide2: {
          src: "assets/Enamorado/1.png",
          title: "Characters",
          desc: ""
        },
        slide3: {
          src: "assets/Enamorado/2.png",
          title: "Characters",
          desc: ""
        },
        slide4: {
          src: "assets/Enamorado/3.png",
          title: "Characters",
          desc: ""
        },
        slide5: {
          src: "assets/Enamorado/4.png",
          title: "Characters",
          desc: ""
        },
        slide6: {
          src: "assets/Enamorado/5.png",
          title: "Characters",
          desc: ""
        },
        slide7: {
          src: "assets/Enamorado/6.png",
          title: "Happy Ending",
          desc: ""
        },
        slide7: {
          src: "assets/Enamorado/7.png",
          title: "All possible masks",
          desc: ""
        }
      },

      overviewParagraphs: [
        'Your cousin has invited you to the local festival in Villa Careta, but the final dance is just around the corner and you still don\'t have a date! Will you be able to charm the town\'s eligible bachelors and become the star of the night? A point-and-click narrative dating sim developed around the game jam theme "Mask".'
      ],

      meta: {
        engine:
          "Unity",

        role:
          "2D Artist",

        team:
          "10 Participants",

        duration:
          "3 Days",

        itchio:
          "https://tyzarzuela.itch.io/mi-enamorado-enmascarado",

        keywords:
          "Jam, Point & Click, Narrative, Dating Sim, Visual Novel, 2D Art"
      },

      middleImageSrc:
        "",

      contributions: [
        {
          title:
            "2D Art & Asset Creation",
          desc:
            "Designed and created all 2D artistic assets, including character sprites, backgrounds, and user interface elements."
        }
      ]

    }, 'title-purple')
},
  'jam-4': {
  title:
    "Riega la nota o aplasta la bichota",

  fullDetails:
    getProjectTemplate({

      media: {
        slide1: {
          src: "assets/Riega/RiegaLaNota.mp4",
          title: "Riega la nota Overview",
          desc: ""
        },
        slide2: {
          src: "assets/Riega/1.png",
          title: "Main Menu",
          desc: "Rhythm mechanics and protecting plants from pests"
        }
      },

      overviewParagraphs: [
        'A rhythm-based game where two scientists help plants grow using culturally inspired music while protecting them from insects and strange pests. Play along with the rhythm to make the plants grow and keep the bugs at bay before they pile up!'
      ],

      meta: {
        engine:
          "Godot",

        role:
          "Game & UX Designer / Level Designer & 2D Artist",

        team:
          "7 Participants",

        duration:
          "4 Days",

        itchio:
          "https://davidrainder.itch.io/riega-la-nota-o-aplasta-la-bichota",

        keywords:
          "Godot, Game Jam 2025, Rhythm, Co-op, 2D Art, Puzzles"
      },

      middleImageSrc:
        "",

      contributions: [
        {
          title:
            "Game Design, UX & Level Testing",
          desc:
            "Focused on game design, user experience (UX), level implementation, and testing in Godot."
        },
        {
          title:
            "Artistic Design & Implementation",
          desc:
            "Artistic design and implementation of in-game sprites."
        }
      ]

    }, 'title-green')
}
};


/* =========================================================
   BACKGROUND DECORATIVE ICONS
   ========================================================= */

function generateRandomBackgroundIcons() {

  const container =
    document.getElementById('bg-decorations');

  if (!container) return;


  const iconTemplates = [

    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
      <circle cx="15" cy="13" r="1"></circle>
      <circle cx="18" cy="11" r="1"></circle>
      <rect x="2" y="6" width="20" height="12" rx="6"></rect>
    </svg>`,

    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>`,

    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>`,

    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
    </svg>`

  ];


  const themeColors = [
    '#2d3748',
    '#4a5568',
    '#718096',
    '#9ca3af',
    '#d1d5db',
    '#a3e635',
    '#84cc16',
    '#65a30d'
  ];


  const cols = 8;
  const rows = 8;


  const cellWidth =
    100 / cols;

  const cellHeight =
    100 / rows;


  for (let r = 0; r < rows; r++) {

    for (let c = 0; c < cols; c++) {

      if (Math.random() < 0.1) continue;


      const wrapper =
        document.createElement('div');

      wrapper.className =
        'bg-icon-auto';


      wrapper.innerHTML =
        iconTemplates[
          Math.floor(
            Math.random() * iconTemplates.length
          )
        ];


      const jitterX =
        (Math.random() - 0.5) *
        (cellWidth * 0.55);

      const jitterY =
        (Math.random() - 0.5) *
        (cellHeight * 0.55);


      const leftPos =
        (c * cellWidth) +
        (cellWidth / 2) +
        jitterX;

      const topPos =
        (r * cellHeight) +
        (cellHeight / 2) +
        jitterY;


      const size =
        Math.floor(Math.random() * 40) + 24;

      const rotation =
        Math.floor(Math.random() * 360);

      const opacity =
        (Math.random() * 0.15 + 0.10).toFixed(2);


      const color =
        themeColors[
          Math.floor(
            Math.random() * themeColors.length
          )
        ];


      wrapper.style.left =
        `${leftPos}%`;

      wrapper.style.top =
        `${topPos}%`;

      wrapper.style.width =
        `${size}px`;

      wrapper.style.height =
        `${size}px`;

      wrapper.style.color =
        color;

      wrapper.style.opacity =
        opacity;

      wrapper.style.transform =
        `translate(-50%, -50%) rotate(${rotation}deg)`;


      container.appendChild(wrapper);

    }

  }

}


/* =========================================================
   MAIN PROJECT CARDS
   ========================================================= */

function updateCardBackgrounds() {

  const cards =
    document.querySelectorAll('.main-card');


  cards.forEach((card, index) => {

    const project =
      mainProjectsData[index + 1];


    if (
      project &&
      project.cardImage
    ) {

      card.style.backgroundImage =
        `url('${project.cardImage}')`;

    } else {

      card.style.backgroundImage =
        'none';

    }

  });

}


function selectMainProject(index) {

  currentSelectedProject =
    index;


  const cards =
    document.querySelectorAll('.main-card');


  cards.forEach((card, i) => {

    if (i === index - 1) {

      card.classList.add('active');

    } else {

      card.classList.remove('active');

    }

  });


  const data =
    mainProjectsData[index];


  if (data) {

    document.getElementById(
      'main-project-title'
    ).textContent =
      data.title;


    const statusElem = document.getElementById('main-project-status');
    statusElem.textContent = data.status;

    // Asignar clase según el estado
    if (data.status === 'COMPLETED' || data.status === 'RELEASED') {
      statusElem.className = 'status-tag status-green';
    } else if (data.status === 'IN PROGRESS') {
      statusElem.className = 'status-tag status-purple';
    } else {
      statusElem.className = 'status-tag';
    }


    document.getElementById(
      'main-project-desc'
    ).textContent =
      data.desc;


    document.getElementById(
      'main-project-engine'
    ).textContent =
      data.engine;


    document.getElementById(
      'main-project-role'
    ).textContent =
      data.role;


    document.getElementById(
      'main-project-genre'
    ).textContent =
      data.genre;

  }

}


/* =========================================================
   CATEGORY SWITCHING
   ========================================================= */

function switchCategory(
  categoryId,
  btnElement
) {

  document
    .querySelectorAll('.category-group')
    .forEach(group => {

      group.classList.remove('active');

    });


  document
    .querySelectorAll('.tab-btn')
    .forEach(btn => {

      btn.classList.remove('active');

    });


  const targetGroup =
    document.getElementById(
      'cat-' + categoryId
    );


  if (targetGroup) {

    targetGroup.classList.add('active');

  }


  if (btnElement) {

    btnElement.classList.add('active');

  }


  const pathNames = {

    'main-projects':
      'MAIN PROJECTS',

    'programming':
      'PROGRAMMING',

    'level-design':
      'LEVEL DESIGN',

    'game-jams':
      'GAME JAMS'

  };


  const categoryPath =
    document.getElementById(
      'category-path'
    );


  if (categoryPath) {

    categoryPath.textContent =
      pathNames[categoryId];

  }


  const tagFilterBar =
    document.getElementById(
      'global-tag-filter'
    );


  if (tagFilterBar) {

    if (
      categoryId ===
      'main-projects'
    ) {

      tagFilterBar.classList.add(
        'hidden-by-filter'
      );

    } else {

      tagFilterBar.classList.remove(
        'hidden-by-filter'
      );

    }

  }


  const allChip =
    document.querySelector(
      '.tag-chip'
    );


  if (allChip) {

    filterByTag(
      'ALL',
      allChip
    );

  }

}


/* =========================================================
   MODALS
   ========================================================= */

function openActiveMainProjectModal() {

  const data =
    mainProjectsData[
      currentSelectedProject
    ];


  if (data) {

    openModal(
      data.title,
      data.fullDetails
    );

  }

}


function openSecondaryProjectModal(key) {

  const data =
    secondaryProjectsData[key];


  if (data) {

    openModal(
      data.title,
      data.fullDetails
    );

  }

}


function openModal(
  title,
  contentHTML
) {

  document.getElementById(
    'modal-title'
  ).textContent =
    title;


  document.getElementById(
    'modal-description'
  ).innerHTML =
    contentHTML;


  document.getElementById(
    'project-modal'
  ).classList.add(
    'active'
  );


  currentSlideIndex =
    0;

}


function closeModal() {
  const modal = document.getElementById('project-modal');
  
  // Pausar y reiniciar todos los vídeos contenidos dentro del modal
  const videos = modal.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });

  modal.classList.remove('active');
}


function closeModalOnBackdrop(
  event
) {

  if (
    event.target.id ===
    'project-modal'
  ) {

    closeModal();

  }

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    generateRandomBackgroundIcons();

    updateCardBackgrounds();

    selectMainProject(1);

  }
);


/* =========================================================
   SIDEBAR DROPDOWN
   ========================================================= */

function toggleDropdown(
  dropdownId,
  categoryId,
  btnElement
) {

  const container =
    btnElement.closest(
      '.sidebar-dropdown'
    );


  const isOpen =
    container.classList.contains(
      'open'
    );


  if (isOpen) {

    container.classList.remove(
      'open'
    );

  } else {

    container.classList.add(
      'open'
    );

  }


  switchCategory(
    categoryId,
    btnElement
  );

}


/* =========================================================
   PROGRAMMING SUBCATEGORIES
   ========================================================= */

function filterSubcategory(
  subcat,
  btnElement
) {

  switchCategory(
    'programming',
    document.querySelector(
      '.has-arrow'
    )
  );


  document
    .querySelectorAll(
      '.sub-tab-btn'
    )
    .forEach(btn => {

      btn.classList.remove(
        'active'
      );

    });


  btnElement.classList.add(
    'active'
  );


  const container =
    document.getElementById(
      'cat-programming'
    );


  const cards =
    container.querySelectorAll(
      '.project-folder-card'
    );


  const headers =
    container.querySelectorAll(
      '.subcategory-header'
    );


  if (
    subcat === 'all'
  ) {

    cards.forEach(card =>
      card.classList.remove(
        'hidden-by-filter'
      )
    );


    headers.forEach(header =>
      header.classList.remove(
        'hidden-by-filter'
      )
    );

  } else {

    cards.forEach(card => {

      if (
        card.dataset.subcat ===
        subcat
      ) {

        card.classList.remove(
          'hidden-by-filter'
        );

      } else {

        card.classList.add(
          'hidden-by-filter'
        );

      }

    });


    headers.forEach(header =>
      header.classList.add(
        'hidden-by-filter'
      )
    );

  }


  document.getElementById(
    'category-path'
  ).textContent =
    `PROGRAMMING / ${subcat.toUpperCase()}`;

}


/* =========================================================
   TAG FILTER
   ========================================================= */

function filterByTag(
  tag,
  chipElement
) {

  document
    .querySelectorAll(
      '.tag-chip'
    )
    .forEach(c => {

      c.classList.remove(
        'active'
      );

    });


  if (chipElement) {

    chipElement.classList.add(
      'active'
    );

  }


  const activeCategory =
    document.querySelector(
      '.category-group.active'
    );


  if (!activeCategory) return;


  const cards =
    activeCategory.querySelectorAll(
      '.project-folder-card'
    );


  const headers =
    activeCategory.querySelectorAll(
      '.subcategory-header'
    );


  if (
    tag === 'ALL'
  ) {

    cards.forEach(card =>
      card.classList.remove(
        'hidden-by-filter'
      )
    );


    headers.forEach(header =>
      header.classList.remove(
        'hidden-by-filter'
      )
    );


    return;

  }


  cards.forEach(card => {

    const cardTags =
      card.dataset.tags || '';


    if (
      cardTags
        .toLowerCase()
        .includes(
          tag.toLowerCase()
        )
    ) {

      card.classList.remove(
        'hidden-by-filter'
      );

    } else {

      card.classList.add(
        'hidden-by-filter'
      );

    }

  });


  headers.forEach(header =>
    header.classList.add(
      'hidden-by-filter'
    )
  );

}

function renderProjectPage(project) {
  const container = document.getElementById('project-detail-container'); // Ajusta a tu ID de contenedor

  container.innerHTML = `
    <div class="project-header">
      <h1>${project.title}</h1>
      <span class="badge">${project.tag}</span>
    </div>

    <!-- Metadata Section -->
    <div class="project-metadata">
      <p><strong>Duration:</strong> ${project.metadata.duration}</p>
      <p><strong>Engine:</strong> ${project.metadata.engine}</p>
      <p><strong>Role:</strong> ${project.metadata.role}</p>
      <p><strong>Tags:</strong> ${project.tags.join(', ')}</p>
    </div>

    <!-- Overview Section -->
    <div class="project-section">
      <h2>Overview</h2>
      <p>${project.overview}</p>
    </div>

    <!-- Key Contributions Section -->
    <div class="project-section">
      <h2>My Contributions</h2>
      <ul>
        ${project.myContributions.map(c => `
          <li>
            <strong>${c.title}:</strong>${c.description}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}