import * as React from "react";
import { Card } from "@themesberg/react-bootstrap";
import { DefaultCard } from "../../components/card";

import "./_UiComponent.scss";
import "./_UiComponentFontSize.scss";
import "./_UiComponentBorderRadiousHelpers.scss";
import "./_UiComponentSpacingHelpers.scss";
import "./_boxShadowHelper.scss";
import "./_imageHelper.scss";
import "./_gradientHelper.scss";
const UiComponent = () => {
  /**
   * cardProps must need to pass into DefaultCard component.
   * headerSlot: this is a placeholder for action buttons on card header.
   *
   * @type {{headerSlot: (function(): *), title: string}}
   */
  const cardProps = {
    title: "Ui Components",
  };

  return (
    <DefaultCard className="mb-50" {...cardProps}>
      <Card border="white" className="ui table-wrapper table-responsive">
        <Card.Body>
          <p>Dashboard Page</p>
          <div class="row">
            <div class="col-md-8 col-sm-8">
              <div class="card ">
                <div class="card-head">
                  <header>HEADINGS</header>
                </div>
                <div class="card-body ">
                  <div class="row">
                    <div class="table-responsive">
                      <table class="table table-condensed table-borderless">
                        <tbody>
                          <tr>
                            <td class="col-10">
                              <h1>h1. Heading 1</h1>
                            </td>
                            <td class="type-info">Light 36px</td>
                          </tr>
                          <tr>
                            <td>
                              <h2 class="">h2. Heading 2</h2>
                            </td>
                            <td class="type-info">Light 30px</td>
                          </tr>
                          <tr>
                            <td>
                              <h3 class="">h3. Heading 3</h3>
                            </td>
                            <td class="type-info">Light 24px</td>
                          </tr>
                          <tr>
                            <td>
                              <h4 class="">h4. Heading 4</h4>
                            </td>
                            <td class="type-info">Light 20px</td>
                          </tr>
                          <tr>
                            <td>
                              <h5 class="">h5. Heading 5</h5>
                            </td>
                            <td class="type-info">Light 16px</td>
                          </tr>
                          <tr>
                            <td>
                              <h5 class="">h6. Heading 6</h5>
                            </td>
                            <td class="type-info">Light 14px</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4">
              <div class="card ">
                <div class="card-head">
                  <header>WEIGHT</header>
                </div>
                <div class="card-body ">
                  <div class="row">
                    <h3 class="text-light full-width">Light text</h3>
                    <h3 class="text-normal full-width">Normal text</h3>
                    <h3 class="text-medium full-width">Medium text</h3>
                    <h3 class="text-bold full-width">Bold text</h3>
                    <h3 class="text-ultra-bold full-width">Ultra bold text</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class=" col-md-8">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Colored Text</header>
                </div>
                <div class="card-body ">
                  <p class="text-yellow"> text-yellow </p>
                  <p class="text-black"> text-black </p>
                  <p class="text-green"> text-green </p>
                  <p class="text-primary">.text-primary</p>
                  <p class="text-secondary">.text-secondary</p>
                  <p class="text-success">.text-success</p>
                  <p class="text-danger">.text-danger</p>
                  <p class="text-warning">.text-warning</p>
                  <p class="text-info">.text-info</p>
                  <p class="text-light bg-dark">.text-light</p>
                  <p class="text-dark">.text-dark</p>
                  <p class="text-muted">.text-muted</p>
                  <p class="text-white bg-dark">.text-white</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Background color</header>
                </div>
                <div class="card-body ">
                  <div class="row">
                    <div class="p-3 mb-2 bg-primary text-white">
                      .bg-primary
                    </div>
                    <div class="p-3 mb-2 bg-secondary text-white">
                      .bg-secondary
                    </div>
                    <div class="p-3 mb-2 bg-success text-white">
                      .bg-success
                    </div>
                    <div class="p-3 mb-2 bg-danger text-white">.bg-danger</div>
                    <div class="p-3 mb-2 bg-warning text-dark">.bg-warning</div>
                    <div class="p-3 mb-2 bg-info text-white">.bg-info</div>
                    <div class="p-3 mb-2 bg-light text-dark">.bg-light</div>
                    <div class="p-3 mb-2 bg-dark text-white">.bg-dark</div>
                    <div class="p-3 mb-2 bg-white text-dark">.bg-white</div>
                  </div>
                </div>
              </div>
            </div>
            <div class=" col-md-8">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Borders</header>
                </div>
                <div class="card-body ">
                  <span class="border"></span>
                  <span class="border border-0"></span>
                  <span class="border border-top-0"></span>
                  <span class="border border-right-0"></span>
                  <span class="border border-bottom-0"></span>
                  <span class="border border-left-0"></span>
                  <span class="border border-primary"></span>
                  <span class="border border-secondary"></span>
                  <span class="border border-success"></span>
                  <span class="border border-danger"></span>
                  <span class="border border-warning"></span>
                  <span class="border border-info"></span>
                  <span class="border border-light"></span>
                  <span class="border border-dark"></span>
                  <span class="border border-white"></span>
                  <header>Borders size</header>
                  <span class="border b-size-1"></span>
                  <span class="border b-size-2"></span>
                  <span class="border b-size-3"></span>
                  <span class="border b-size-4"></span>
                  <span class="border b-size-5"></span>
                  <header>Borders styles</header>

                  <p class="b-dotted">A dotted border.</p>
                  <p class="b-dashed">A dashed border.</p>
                  <p class="b-solid">A solid border.</p>
                  <p class="b-double">A double border.</p>
                  <p class="b-groove">A groove border.</p>
                  <p class="b-ridge">A ridge border.</p>
                  <p class="b-inset">An inset border.</p>
                  <p class="b-outset">An outset border.</p>
                  <p class="b-none">No border.</p>
                  <p class="b-hidden">A hidden border.</p>
                  <p class="b-mix">A mixed border.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Border Radius</header>
                </div>
                <div class="card-body radius">
                  <span class="rounded-sm"></span>
                  <span class="rounded"></span>
                  <span class="rounded-lg"></span>
                  <span class="rounded-top"></span>
                  <span class="rounded-right"></span>
                  <span class="rounded-bottom"></span>
                  <span class="rounded-left"></span>
                  <span class="rounded-circle"></span>
                  <span class="rounded-0"></span>
                </div>
              </div>
            </div>
            <div class="col-md-8 col-sm-8">
              <div class="card mt-5">
                <div class="card-head">
                  <header>Position</header>
                </div>
                <div class="card-body ">
                  <div class="position-relative">
                    <div class="position-absolute top-0 start-0"></div>
                    <div class="position-absolute top-0 end-0"></div>
                    <div class="position-absolute top-50 start-50"></div>
                    <div class="position-absolute bottom-50 end-50"></div>
                    <div class="position-absolute bottom-0 start-0"></div>
                    <div class="position-absolute bottom-0 end-0"></div>
                  </div>
                </div>
                <div class="card-body ">
                  <div class="position-relative">
                    <div class="position-absolute top-0 start-0 translate-middle"></div>
                    <div class="position-absolute top-0 start-50 translate-middle"></div>
                    <div class="position-absolute top-0 start-100 translate-middle"></div>
                    <div class="position-absolute top-50 start-0 translate-middle"></div>
                    <div class="position-absolute top-50 start-50 translate-middle"></div>
                    <div class="position-absolute top-50 start-100 translate-middle"></div>
                    <div class="position-absolute top-100 start-0 translate-middle"></div>
                    <div class="position-absolute top-100 start-50 translate-middle"></div>
                    <div class="position-absolute top-100 start-100 translate-middle"></div>
                  </div>
                </div>
                <div class="card-body ">
                  <div class="position-relative">
                    <div class="position-relative">
                      <div class="position-absolute top-0 start-0"></div>
                      <div class="position-absolute top-0 start-50 translate-middle-x"></div>
                      <div class="position-absolute top-0 end-0"></div>
                      <div class="position-absolute top-50 start-0 translate-middle-y"></div>
                      <div class="position-absolute top-50 start-50 translate-middle"></div>
                      <div class="position-absolute top-50 end-0 translate-middle-y"></div>
                      <div class="position-absolute bottom-0 start-0"></div>
                      <div class="position-absolute bottom-0 start-50 translate-middle-x"></div>
                      <div class="position-absolute bottom-0 end-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-4">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Box Shadow</header>
                </div>
                <div class="card-body radius text-center">
                  <span class="rounded-sm text-primary box-shadow-1 bg-white">
                    1
                  </span>
                  <span class="rounded-sm text-primary box-shadow-2  bg-white">
                    2
                  </span>
                  <span class="rounded-sm text-primary box-shadow-3  bg-white">
                    3
                  </span>
                  <span class="rounded-sm text-primary box-shadow-4  bg-white">
                    4
                  </span>
                  <span class="rounded-sm text-primary box-shadow-5  bg-white">
                    5
                  </span>
                  <span class="rounded-sm text-primary box-shadow-6  bg-white">
                    6
                  </span>
                  <span class="rounded-sm text-primary box-shadow-7  bg-white">
                    7
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-12 col-sm-12">
              <div class="card mt-10">
                <div class="card-head">
                  <header>Gradiants</header>
                </div>
                <div class="card-body radius text-center ">
                  <span class="rounded-sm text-white grad-1">1</span>
                  <span class="rounded-sm text-white grad-2">2</span>
                  <span class="rounded-sm text-white  grad-3 ">3</span>
                  <span class="rounded-sm text-white grad-4">4</span>
                  <span class="rounded-sm text-white grad-5">5</span>
                  <span class="rounded-sm text-white grad-6">6</span>
                  <span class="rounded-sm text-white grad-7">7</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </DefaultCard>
  );
};

export default UiComponent;
