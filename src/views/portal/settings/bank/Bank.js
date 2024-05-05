import * as Yup from "yup";
const banglaLang = /^[\p{sc=Bengali}\s]+$/u;
class BankModel {
    constructor() {
        this.bankName = "";
        this.bankNameBn = "";
        this.bankId = 0;
        this.swiftcode = "";
        this.bankWebUrl = "";
    }

    fromJson(data = {}) {
        let obj = new BankModel();
        if (data.id !== undefined && data.id) {
            obj.id = data.id;
        }

        obj.bankName = data.bankName;
        obj.bankNameBn = data.bankNameBn;
        obj.bankId = data.bankId;
        obj.swiftcode = data.swiftcode;
        obj.bankWebUrl = data.bankWebUrl
        return obj;
    }

    toString(data = {}) {
        let obj = new BankModel().fromJson(data);
        return JSON.stringify(obj);
    }

    validation() {
        return Yup.object().shape({
            bankName: Yup.string().required("Required"),
            bankNameBn: Yup.string().matches(
                banglaLang,
                "Please type in Bangla"
            ),
            bankWebUrl: Yup.string().required("Required"),
            swiftcode: Yup.string().required("Required"),
        });
    }
}

export const Bank = new BankModel();
