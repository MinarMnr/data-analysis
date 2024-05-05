import * as Yup from "yup";

class reportModel {
    constructor() {
        this.id = "";
        this.reportId = "";
        this.column_value = "";
        this.datasetList = [];
        this.reportMenuGroupId = "";
        this.datasetRelationList = [
            // {
            //     datasetColumnNameLeft: "",
            //     datasetColumnNameRight: "",
            //     datasetJoinOperator: "",
            //     datasetJoinType: "",
            //     reportDatasetIdLeft: 0,
            //     reportDatasetIdRight: 0,
            // },
        ];
        this.groupList = [];
        this.filterList = [];
        this.columnList = [];
        this.valueList = [];
        this.pivotList = [
            // {
            //     pivotValueList: [
            //         {
            //             datasetId: 0,
            //             columnName: "",
            //             columnAlias: "",
            //             columnFormula: "",
            //             columnAggregateFunction: "",
            //         },
            //     ],
            // },
        ];
        // this.tableRelationList = [
        //     {
        //         dataset1: "",
        //         dataset2: "",
        //         operator: "",
        //         columnSet1: "",
        //         columnSet2: "",
        //     },
        // ];
        this.leftColumnSetList = [];
        this.rightColumnSetList = [];
        this.reportChart = {
            chartTitle: "",
            valueList: [],
            dataList: [],
        };
        this.isIncludeChart = "";
        this.reportTitle = "";
        this.reportDescription = "";
        this.reportOrientation = "Portrait";
        this.reportPageSize = "A4";
        this.isAllColumnSqlGroup = "";
        this.reportNumber = "";

        this.analytics = [];
        this.isAnalytics = false;
        this.appModuleId = "";
    }

    fromJson(data = {}) {
        let obj = new reportModel();
        if (data.id !== undefined && data.id) {
            obj.id = data.id;
        }

        obj.reportId = data.reportId ?? "";

        obj.datasetList = data.datasetList;
        obj.groupList = data.groupList ?? [];
        obj.filterList = data.filterList ?? [];
        obj.columnList = data.columnList ?? [];
        obj.valueList = data.valueList ?? [];
        obj.pivotList = data.pivotList ?? [];
        obj.datasetRelationList = data.datasetRelationList;
        obj.leftColumnSetList = data.leftColumnSetList ?? [];
        obj.rightColumnSetList = data.rightColumnSetList ?? [];
        obj.reportChart = data.reportChart;
        obj.isIncludeChart = data.isIncludeChart ?? "";
        obj.reportMenuGroupId = data.reportMenuGroupId ?? "";

        obj.reportTitle = data.reportTitle;
        obj.reportDescription = data.reportDescription ?? "";
        obj.reportOrientation = data.reportOrientation;
        obj.reportPageSize = data.reportPageSize ?? "";

        obj.isAllColumnSqlGroup = data.isAllColumnSqlGroup ?? "";
        obj.reportNumber = data.reportNumber ?? "";

        obj.isAnalytics = data.isAnalytics ?? false;

        obj.appModuleId = data.appModuleId ?? "";

        return obj;
    }

    toString(data = {}) {
        let obj = new reportModel().fromJson(data);

        return JSON.stringify(obj);
    }

    // const inst2 = yup.object().shape(
    //     {
    //       location: yup.object().shape({
    //         state: yup
    //           .string()
    //           .when('county', {
    //              is: '',
    //              then: yup.string().required(),
    //              otherwise: yup.string()
    //           }),
    //         county: yup
    //           .string()
    //           .when('state', {
    //              is: '',
    //              then: yup.string().required(),
    //              otherwise: yup.string()
    //           })
    //       }, ['county', 'state'])
    //     }
    //   )

    validation() {
        return Yup.object().shape({
            reportTitle: Yup.string()
                .required("Required")
                .typeError(`Required`),
            // reportDescription: Yup.string()
            //     .required("Required")
            //     .typeError(`Required`),

            reportOrientation: Yup.string()
                .required("Required")
                .typeError(`Required`),
            reportPageSize: Yup.string()
                .required("Required")
                .typeError(`Required`),

            isAnalytics: Yup.string()
                .required("Required")
                .typeError(`Required`),

            datasetRelationList: Yup.array().of(
                Yup.object().shape(
                    {
                        reportDatasetIdLeft: Yup.string().when(
                            "reportDatasetIdRight",
                            {
                                is: (val) => {
                                    return val && Number(val) > 0;
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`)
                                    .test(
                                        "lessData",
                                        "Required",
                                        (value, testContext) => {
                                            return value > 0;
                                        }
                                    ),
                                otherwise: Yup.string().nullable(),
                            }
                        ),

                        datasetColumnNameLeft: Yup.string().when(
                            "reportDatasetIdLeft",
                            {
                                is: (val) => {
                                    return val && Number(val) > 0;
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`),

                                otherwise: Yup.string().nullable(),
                            }
                        ),

                        reportDatasetIdRight: Yup.string().when(
                            "reportDatasetIdLeft",
                            {
                                is: (val) => {
                                    return val && Number(val) > 0;
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`)
                                    .test(
                                        "lessData",
                                        "Required",
                                        (value, testContext) => {
                                            return value > 0;
                                        }
                                    ),
                                otherwise: Yup.string().nullable(),
                            }
                        ),

                        datasetColumnNameRight: Yup.string().when(
                            "reportDatasetIdRight",
                            {
                                is: (val) => {
                                    return val && Number(val) > 0;
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`),
                                otherwise: Yup.string().nullable(),
                            }
                        ),

                        datasetJoinType: Yup.string().when(
                            ["reportDatasetIdLeft", "reportDatasetIdRight"],
                            {
                                is: (leftVal, rightVal) => {
                                    return (
                                        (leftVal && Number(leftVal) > 0) ||
                                        (rightVal && Number(rightVal) > 0)
                                    );
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`),
                                otherwise: Yup.string().nullable(),
                            }
                        ),

                        datasetJoinOperator: Yup.string().when(
                            ["reportDatasetIdLeft", "reportDatasetIdRight"],
                            {
                                is: (leftVal, rightVal) => {
                                    return (
                                        (leftVal && Number(leftVal) > 0) ||
                                        (rightVal && Number(rightVal) > 0)
                                    );
                                },
                                then: Yup.string()
                                    .required(`Required`)
                                    .typeError(`Required`),
                                otherwise: Yup.string().nullable(),
                            }
                        ),
                    },
                    ["reportDatasetIdRight", "reportDatasetIdLeft"]
                )
            ),

            filterList: Yup.array().of(
                Yup.object().shape({
                    controlType: Yup.string().when("columnName", {
                        is: (columnName) => columnName,
                        then: Yup.string()
                            .required("Required")
                            .typeError("Required"),
                        otherwise: null,
                    }),
                })
            ),

            pivotList: Yup.array().of(
                Yup.object().shape({
                    pivotValueList: Yup.array().of(
                        Yup.object().shape({
                            datasetId: Yup.string()
                                .required("Required")
                                .typeError("Required"),

                            columnName: Yup.string()
                                .required("Required")
                                .typeError("Required"),
                            columnAggregateFunction: Yup.string().when(
                                "datasetId",
                                {
                                    is: (datasetId) => datasetId,
                                    then: Yup.string()
                                        .required("Required")
                                        .typeError("Required"),
                                    otherwise: null,
                                }
                            ),

                            columnGrandCalcType: Yup.string().when(
                                "datasetId",
                                {
                                    is: (datasetId) => datasetId,
                                    then: Yup.string()
                                        .required("Required")
                                        .typeError("Required"),
                                    otherwise: null,
                                }
                            ),
                        })
                    ),
                })
            ),
        });
    }
}

export const Report = new reportModel();
