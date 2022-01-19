const  __ = function(){};
export default `
<div class="lt-vapp theme-light collapsible">

  <header class="lt-vapp-header no-header">
    <div class="lt-vapp-header-inner">
      <h1 class="lt-vapp-company_logo"></h1>
      <h2  class="lt-vapp-application_name">${ __("Account management") }</h2>
    </div>
    <figure class="lt-vapp-logtrust-powered">
      <figcaption> Powered by </figcaption>
      <span class="lticon-logo_full"></span>
    </figure>
  </header>

  <nav class="lt-vapp-menu">
    <ul class="lt-vapp-menu-main">

      <!-- MAIN 1 -->
      <li main="main1">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("COLUMN & BAR")}</span>
        </p>
      </li>

      <!-- MAIN 2 -->
      <li main="main2">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("LINE & AREA")}</span>
        </p>
      </li>

      <!--MAIN 3 -->
      <li main="main3">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("PIE & FUNNEL")}</span>
        </p>
      </li>

      <!-- MAIN 4 -->
      <li main="main4">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("XY & Bubble")}</span>
        </p>
      </li>

      <!-- MAIN 5 -->
      <li main="main5">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("GAUGES & OTHERS")}</span>
        </p>
        <nav class="lt-vapp-menu-scroll">
          <p class="lt-vapp-menu-scroll-titles">
            <strong>${__("Quick access")}</strong>
            <span>${__("Scroll to one of the sections")}</span>
          </p>
          <ul>
            <li section="Section51">${__("Tab5")}</li>
          </ul>
        </nav>
      </li>

      <!-- MAIN 6 -->
      <li main="main6">
        <p class="lt-vapp-menu-item-name">
          <i class="lticon-analytics_presentation_statistics_graph"></i>
          <span>${__("MAPS")}</span>
        </p>
        <nav class="lt-vapp-menu-scroll">
          <p class="lt-vapp-menu-scroll-titles">
            <strong>${__("Quick access")}</strong>
            <span>${__("Scroll to one of the sections")}</span>
          </p>
          <ul>
            <li section="Section61">${__("Tab6")}</li>
          </ul>
        </nav>
      </li>
    </ul>

    <ul class="lt-vapp-menu-preferences">
      <li class="lt-vapp-capture-button" title="Capture app">
        <span class="lticon-polaroid_picture_image_photo"></span>
      </li>
      <li class="lt-vapp-options-button va-menu-trigger" title="General settings">
        <span class="lticon-settings_gear_preferences"></span>
      </li>
    </ul>
  </nav>

  <nav class="lt-vapp-config closed">
    <p class="lt-vapp-config-bar">
      <i class="lt-vapp-config-close LtAppIcon-close2"></i>
      <span>${__("Close")}</span>
    </p>

    <h4>
      <i class="lticon-settings_gear_preferences"></i>
      <span>${__("Settings")}</span>
    </h4>

    <div class="lt-vapp-config-form-wrapper">
      <form class="lt-form under-label">
        <div class="lt-form-column-wrapper">
          <div class="lt-form-column">
            <h3 class="lt-form-title">${__("Visual Settings")}</h3>
            <fieldset class="lt-form-group">
              <div class="lt-form-field">
                <label>${__("Theme")}</label>
                <select id="theme">
                  <option value="theme-imagenio" selected>Imagenio</option>
                  <option value="theme-dark">${__("Dark")}</option>
                  <option value="theme-light" >${__("Light")}</option>
                </select>
              </div>
              <div class="lt-form-field">
                <label>${__("Titles size")}</label>
                <select id="titleSize">
                  <option value="small-headers">${__("Small")}</option>
                  <option value="" selected>${__("Normal")}</option>
                  <option value="big-headers">${__("Big")}</option>
                </select>
              </div>
            </fieldset>
          </div>

          <div class="lt-form-column">
            <fieldset class="lt-form-group">
              <div class="lt-form-field-inline">
                <input type="checkbox" id="displayCompact">
                <label for="displayCompact">
                  ${__("Compact view")}
                </label>
              </div>

              <div class="lt-form-field-inline">
                <input type="checkbox" id="displayBordered">
                <label for="displayBordered">
                  ${__("Bordered sections titles")}
                </label>
              </div>

              <div class="lt-form-field-inline">
                <input type="checkbox" id="displayCollapsibles" checked>
                <label for="displayCollapsibles">
                  ${__("Collapsible sections & widgets")}
                </label>
              </div>

              <div class="lt-form-field-inline">
                <input type="checkbox" id="displayDescription" checked>
                <label for="displayDescription">
                  ${__("Show widgets descriptions")}
                </label>
              </div>

              <div class="lt-form-field-inline">
                <input type="checkbox" id="displayMenuWidgetsExpanded" checked>
                <label for="displayMenuWidgetsExpanded">
                  ${__("Widgets options always visible")}
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <h3 class="lt-form-title">${__("Advanced settings")}</h3>
        <div class="lt-form-column-wrapper">
          <div class="lt-form-column">
            <fieldset class="lt-form-group">
              <div class="lt-form-field">

                <label>${__("From")}</label>
                <div class="selectWrapper custom_from_date">
                  <input type="hidden" value="" />
                  <div class="dropArrowDown">
                    <span class="LtAppIcon-arrow_down"></span>
                  </div>
                  <span class="custom_from_date_container"></span>
                </div>

              </div>
            </fieldset>
          </div>
          <div class="lt-form-column">
            <fieldset class="lt-form-group">
              <div class="lt-form-field">

                <label>${__("To")}</label>
                <div class="selectWrapper custom_to_date">
                  <input type="hidden" value="">
                  <div class="dropArrowDown">
                    <span class="LtAppIcon-arrow_down"></span>
                  </div>
                  <span class="custom_to_date_container"></span>
                </div>

              </div>
            </fieldset>
          </div>
        </div>

      </form>
    </div>

    <div class="lt-vapp-config-footer">
      <button class="lt-vapp-config-close grey">${__("CANCEL")}</button>
      <button class="lt-vapp-config-update">${__("UPDATE")}</button>
    </div>
  </nav>

  <!-- Main 1: Column & Bar -->
  <!-- ===================================================================== -->

  <main class="lt-vapp-main" id="main1">

    <section class="lt-vapp-section" id="section11">

      <h3 class="lt-vapp-section-title">
        <i class="lticon-analytics_presentation_statistics_graph"></i>
        <span>${__("BASIC")}</span>
        <span class="lt-vapp-section-collapser lticon-vapp_expand"></span>
      </h3>

      <!-- Widget: Stacked Bar -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="stackedBarWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("STACKED BAR")}</h3>
          <nav class="lt-vapp-widget-options">
            <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
            <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
              <ul>
                <li class="lt-vapp-widget-action-capture">
                  <i class="lticon-polaroid_picture_image_photo"></i>
                  <span>${__("Screenshot")}</span>
                </li>
                <li class="lt-vapp-widget-action-download">
                  <i class="lticon-computer_laptop_download"></i>
                  <span>${__("Download data")}</span>
                </li>
                <li class="lt-vapp-widget-action-zoom">
                  <i class="lticon-zoom_in"></i>
                  <span>${__("Zoom")}</span>
                </li>
                <li class="lt-vapp-widget-action-gotosearch">
                  <i class="lticon-search_find_zoom2"></i>
                  <span>${__("Go to query")}</span>
                </li>
              </ul>
            </span>
          </nav>
        </header>
        <div class="lt-vapp-widget-graphic inner-padding"></div>
      </article>

      <!-- Widget: Column -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="columnWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("COLUMN")}</h3>
          <p>${__("Using a forced day X axis.")}</p>
          <nav class="lt-vapp-widget-options">
            <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
            <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
              <ul>
                <li class="lt-vapp-widget-action-capture">
                  <i class="lticon-polaroid_picture_image_photo"></i>
                  <span>${__("Screenshot")}</span>
                </li>
                <li class="lt-vapp-widget-action-download">
                  <i class="lticon-computer_laptop_download"></i>
                  <span>${__("Download data")}</span>
                </li>
                <li class="lt-vapp-widget-action-zoom">
                  <i class="lticon-zoom_in"></i>
                  <span>${__("Zoom")}</span>
                </li>
                <li class="lt-vapp-widget-action-gotosearch">
                  <i class="lticon-search_find_zoom2"></i>
                  <span>${__("Go to query")}</span>
                </li>
              </ul>
            </span>
          </nav>
        </header>
        <div class="lt-vapp-widget-graphic inner-padding"></div>
      </article>

    </section>

  </main>

  <!-- Main 2: Line & Area -->
  <!-- ===================================================================== -->

  <main class="lt-vapp-main" id="main2">

    <section class="lt-vapp-section show-on-reseller" id="section21" >
      <h3 class="lt-vapp-section-title">
        <i class="lticon-analytics_presentation_statistics_graph"></i>
        <span>${__("BASIC")}</span>
        <span class="lt-vapp-section-collapser lticon-vapp_expand"></span>
      </h3>

      <!-- Widget: Line -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id='lineWidget'>
        <header class="lt-vapp-widget-header">
          <h3>${__("LINE")}</h3>
          <nav class="lt-vapp-widget-options">
            <span class="lticon-information_about lt-vapp-widget-info"></span>
            <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
            <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
              <ul>
                <li class="lt-vapp-widget-action-capture">
                  <i class="lticon-polaroid_picture_image_photo"></i>
                  <span>${__("Screenshot")}</span>
                </li>
                <li class="lt-vapp-widget-action-download">
                  <i class="lticon-computer_laptop_download"></i>
                  <span>${__("Download data")}</span>
                </li>
                <li class="lt-vapp-widget-action-zoom">
                  <i class="lticon-zoom_in"></i>
                  <span>${__("Zoom")}</span>
                </li>
                <li class="lt-vapp-widget-action-gotosearch">
                  <i class="lticon-search_find_zoom2"></i>
                  <span>${__("Go to query")}</span>
                </li>
              </ul>
            </span>
          </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>

    </section>

  </main>

  <!-- Main 3: Pie & Funnel -->
  <!-- ===================================================================== -->

  <main class="lt-vapp-main" id="main3">

    <section class="lt-vapp-section show-on-domain" id="section31"  >
      <h3 class="lt-vapp-section-title">
        <i class="lticon-analytics_presentation_statistics_graph"></i>
        <span>${__("BASIC")}</span>
        <span class="lt-vapp-section-collapser lticon-vapp_expand"></span>
      </h3>

      <!-- Widget: Pie -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="pieWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("PIE")}</h3>
          <nav class="lt-vapp-widget-options">
              <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
              <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
                <ul>
                  <li class="lt-vapp-widget-action-capture">
                    <i class="lticon-polaroid_picture_image_photo"></i>
                    <span>${__("Screenshot")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-download">
                    <i class="lticon-computer_laptop_download"></i>
                    <span>${__("Download data")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-zoom">
                    <i class="lticon-zoom_in"></i>
                    <span>${__("Zoom")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-gotosearch">
                    <i class="lticon-search_find_zoom2"></i>
                    <span>${__("Go to query")}</span>
                  </li>
                </ul>
              </span>
            </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>

    </section>

  </main>

  <!-- Main 4: XY & Bubble -->
  <!-- ===================================================================== -->

  <main class="lt-vapp-main" id="main4">

    <section class="lt-vapp-section show-on-domain" id="section41"  >
      <h3 class="lt-vapp-section-title">
        <i class="lticon-analytics_presentation_statistics_graph"></i>
        <span>${__("BASIC")}</span>
        <span class="lt-vapp-section-collapser lticon-vapp_expand"></span>
      </h3>

      <!-- Widget: Voronoi -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="voronoiWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("VORONOI")}</h3>
          <nav class="lt-vapp-widget-options">
              <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
              <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
                <ul>
                  <li class="lt-vapp-widget-action-capture">
                    <i class="lticon-polaroid_picture_image_photo"></i>
                    <span>${__("Screenshot")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-download">
                    <i class="lticon-computer_laptop_download"></i>
                    <span>${__("Download data")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-zoom">
                    <i class="lticon-zoom_in"></i>
                    <span>${__("Zoom")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-gotosearch">
                    <i class="lticon-search_find_zoom2"></i>
                    <span>${__("Go to query")}</span>
                  </li>
                </ul>
              </span>
            </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>

      <!-- Widget: PunchCard -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="punchCardWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("PUNCHCARD")}</h3>
          <nav class="lt-vapp-widget-options">
              <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
              <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
                <ul>
                  <li class="lt-vapp-widget-action-capture">
                    <i class="lticon-polaroid_picture_image_photo"></i>
                    <span>${__("Screenshot")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-download">
                    <i class="lticon-computer_laptop_download"></i>
                    <span>${__("Download data")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-zoom">
                    <i class="lticon-zoom_in"></i>
                    <span>${__("Zoom")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-gotosearch">
                    <i class="lticon-search_find_zoom2"></i>
                    <span>${__("Go to query")}</span>
                  </li>
                </ul>
              </span>
            </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>

    </section>

  </main>

  <!-- Main 5: GAUGES & OTHERS -->
  <!-- ===================================================================== -->

  <main class="lt-vapp-main" id="main5">

    <section class="lt-vapp-section show-on-domain" id="section51"  >
      <h3 class="lt-vapp-section-title">
        <i class="lticon-analytics_presentation_statistics_graph"></i>
        <span>${__("BASIC")}</span>
        <span class="lt-vapp-section-collapser lticon-vapp_expand"></span>
      </h3>

      <!-- Widget: Tree -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="treeWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("TREE")}</h3>
          <nav class="lt-vapp-widget-options">
              <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
              <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
                <ul>
                  <li class="lt-vapp-widget-action-capture">
                    <i class="lticon-polaroid_picture_image_photo"></i>
                    <span>${__("Screenshot")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-download">
                    <i class="lticon-computer_laptop_download"></i>
                    <span>${__("Download data")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-zoom">
                    <i class="lticon-zoom_in"></i>
                    <span>${__("Zoom")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-gotosearch">
                    <i class="lticon-search_find_zoom2"></i>
                    <span>${__("Go to query")}</span>
                  </li>
                </ul>
              </span>
            </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>

      <!-- Widget: DataTables -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="dataTablesWidget">
        <header class="lt-vapp-widget-header">
          <h3>${__("DATATABLES")}</h3>
          <nav class="lt-vapp-widget-options">
              <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
              <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
                <ul>
                  <li class="lt-vapp-widget-action-capture">
                    <i class="lticon-polaroid_picture_image_photo"></i>
                    <span>${__("Screenshot")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-download">
                    <i class="lticon-computer_laptop_download"></i>
                    <span>${__("Download data")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-zoom">
                    <i class="lticon-zoom_in"></i>
                    <span>${__("Zoom")}</span>
                  </li>
                  <li class="lt-vapp-widget-action-gotosearch">
                    <i class="lticon-search_find_zoom2"></i>
                    <span>${__("Go to query")}</span>
                  </li>
                </ul>
              </span>
            </nav>
        </header>
        <div class="lt-vapp-widget-graphic"></div>
      </article>


      <!-- Widget:  Flame Graph -->
      <!-- ================================================================= -->

      <article class="lt-vapp-widget md-6 lg-6 tv-6" id="flameGraph">
        <header class="lt-vapp-widget-header">
          <h3>${__("STACKED BAR")}</h3>
          <nav class="lt-vapp-widget-options">
            <span class="lt-vapp-widget-collapser lticon-vapp_expand"></span>
            <span class="lt-vapp-widget-menu-launcher lticon-thin-0069a_menu_hambuger_bold">
              <ul>
                <li class="lt-vapp-widget-action-capture">
                  <i class="lticon-polaroid_picture_image_photo"></i>
                  <span>${__("Screenshot")}</span>
                </li>
                <li class="lt-vapp-widget-action-download">
                  <i class="lticon-computer_laptop_download"></i>
                  <span>${__("Download data")}</span>
                </li>
                <li class="lt-vapp-widget-action-zoom">
                  <i class="lticon-zoom_in"></i>
                  <span>${__("Zoom")}</span>
                </li>
                <li class="lt-vapp-widget-action-gotosearch">
                  <i class="lticon-search_find_zoom2"></i>
                  <span>${__("Go to query")}</span>
                </li>
              </ul>
            </span>
          </nav>
        </header>
        <div class="lt-vapp-widget-graphic inner-padding"></div>
      </article>

    </section>

  </main>

  <div class="lt-vapp-overlay"></div>
</div>

`
