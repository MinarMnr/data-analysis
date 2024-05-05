import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UrlBuilder } from "./helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "./reducers/apiSlice";
import { AuthUser } from "helpers/AuthUser";

class NaivOption {
  adminUser() {
    const dispatch = useDispatch();
    const [show, setShow] = useState(true);
    const {
      menuList = {
        data: {},
      },
    } = useSelector(selectApi);

    useEffect(() => {
      if (!localStorage.getItem("moduleId")) {
        AuthUser.removeLoginData();

        dispatch(
          clearState({
            output: "authData",
          })
        );

        history.push("/login");
      } else {
        dispatch(
          callApi({
            operationId: UrlBuilder.report(
              `menu-group/list?appModuleId=${localStorage.getItem("moduleId")}`
            ),
            output: "menuList",
          })
        );
      }
    }, [localStorage.getItem("moduleId")]);

    function updateMenuStructure(menuItems) {
      const updatedItems = {
        title: menuItems?.reportMenuGroupTitle,
        path:
          menuItems.reportMenuGroupTitle + "/" + menuItems?.reportMenuGroupId,
        icon: "#",
        data: menuItems,
        children:
          menuItems?.group?.length > 0
            ? menuItems?.group?.map((item) => {
                return item;
              })
            : [],
        aChild:
          menuItems?.associatedReports?.length > 0
            ? menuItems?.associatedReports?.map((item) => {
                const childItem = {
                  title: item.reportTitle,
                  path: `/portal/report/updateReport/${item.reportId}`,
                  data: item,
                  icon: faSchool,
                };
                return childItem;
              })
            : [],
      };

      return menuItems?.group?.length > 0
        ? menuItems?.group.map((item) => {
            const updatedItem = {
              title: item.reportMenuGroupTitle,
              path: item.reportMenuGroupTitle + "/" + item?.reportMenuGroupId,
              icon: faSchool,
              data: item,
              children: item.group?.length > 0 ? updateMenuStructure(item) : [],
              aChild:
                item?.associatedReports?.length > 0
                  ? item?.associatedReports?.map((itm) => {
                      const childItem = {
                        title: itm.reportTitle,
                        path: `/portal/report/updateReport/${itm.reportId}`,
                        data: itm,
                        icon: faSchool,
                      };
                      return childItem;
                    })
                  : [],
            };

            // Check and update the children if present
            // if (item.group && item.group.length > 0) {
            //   updatedItem.children = item.group?.map((childItem) => {
            //     const updatedChildItem = {
            //       title: childItem.reportMenuGroupTitle,
            //       path: childItem?.reportMenuGroupId,
            //       data: childItem,
            //       icon: faSchool,
            //       // Recursively update further nested layers if needed
            //       // For example, adding a hypothetical subgroup
            //       children: childItem.group
            //         ? updateMenuStructure(childItem)
            //         : [],
            //     };
            //     return updatedChildItem;
            //   });

            //   updatedItem.aChild = item.associatedReports.map((aChildItem) => {
            //     const updatedChildItem = {
            //       title: aChildItem.reportTitle,
            //       path: `/portal/report/updateReport/${aChildItem.reportId}`,
            //       data: aChildItem,
            //       icon: faSchool,
            //     };
            //     return updatedChildItem;
            //   });
            // }

            // Add more properties or layers as needed

            return updatedItem;
          })
        : updatedItems;
    }

    let adminSidebar =
      menuList?.data &&
      menuList.data.length > 0 &&
      menuList.data.map((item, index) => {
        return {
          title: item.reportMenuGroupTitle,
          path: item.reportMenuGroupTitle + "/" + item?.reportMenuGroupId,
          icon: faSchool,
          data: item,
          children: updateMenuStructure(item),
          aChild:
            item?.associatedReports &&
            item?.associatedReports.map((aitem) => {
              return {
                title: aitem?.reportTitle,
                path: `/portal/report/updateReport/${aitem.reportId}`,
                icon: faSchool,
              };
            }),
          // [
          //   {
          //     title: "Save Reports",
          //     grandChildren: updateMenuStructure(item),
          //     path: "#",
          //     icon: faSchool,
          //     data: item,
          //     aChild:
          //       item?.associatedReports &&
          //       item?.associatedReports.map((aitem) => {
          //         return {
          //           title: aitem?.reportTitle,
          //           path: `/portal/report/updateReport/${aitem.reportId}`,
          //           icon: faSchool,
          //         };
          //       }),
          //   },

          // ],
        };
      });

    return adminSidebar;
  }
}

export const NaiveOption = new NaivOption();
