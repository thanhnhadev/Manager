import ConfigToken from "../Config/ConfigToken";

export default class FetchApi {
    static GetData = async (url) => {
        return await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.localStorage.getItem(ConfigToken.token)
            },
        }).then((res) => res.json());
    };


    static PostData = async (url, objs) => {
        var formBody = [];
        for (var property in objs) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(objs[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + window.localStorage.getItem(ConfigToken.token)
            },
            body: formBody
        }).then((res) => res.json());
    };

    static PostDataUnAuthorize = async (url, objs) => {
        var formBody = [];
        for (var property in objs) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(objs[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formBody
        }).then((res) => res.json());
    };

    static PutData = async (url, objs) => {
        var formBody = [];
        for (var property in objs) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(objs[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + window.localStorage.getItem(ConfigToken.token)
            },
            body: formBody
        }).then((res) => res.json());
    };

    static DeleteData = async (url) => {
        return await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + window.localStorage.getItem(ConfigToken.token)
            }
        }).then((res) => res.json());
    };
};