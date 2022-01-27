let fileList = [];
const container = document.getElementById("show-container");
const btn = document.getElementsByClassName("upload-btn")[0];
const downloadBtn = document.getElementsByClassName("dowmload-btn")[0];
let fileDom = document.getElementById("file");
fileDom.addEventListener("change", (e) => {
    fileDom.files[0] && fileList.push(fileDom.files[0]);
    render(fileList, container);
});
function createPreviewDom(fileList) {
    let str = "";
    if (fileList.length == 0) return `<li>暂未选择任何文件</li>`;
    fileList.forEach((item) => {
        console.log(item);
        const src = URL.createObjectURL(item);
        str += ` <li>
            <div class="name">${item.name}</div>
            <div class="size">${item.size}</div>
            <div class="preview">
              <img ${src}=".." alt="${item.name}" />
            </div>
          </li>`;
    });
    return str;
}

function renderDownloadDom(file, dom,filename) {
    const src = URL.createObjectURL(file);
    const li = document.createElement("li");
    li.setAttribute("class", "list");
    li.innerHTML = `<div class="name">${file.name}</div>
            <div class="size">${file.size}</div>
            <div class="preview" style="width:100px">
              <img ${src}=".." alt="${file.name}" />
            </div>
            <a href=./download?filename=${filename} download=1.png>下载<a/>
            `;
    dom.appendChild(li)
}

function render(fileList, dom) {
    dom.innerHTML = createPreviewDom(fileList);
}

btn.addEventListener("click", () => {
    fileList.forEach((item) => {
        uploadFile(item, () => {
            fileList = fileList.filter((it) => it !== item);
            render(fileList, container);
        });
    });
});
/**
 * ajax上传
 *
 * */
function uploadFile(file, callback) {
    const formData = new FormData();
    formData.append("imgName", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.send(formData);
    xhr.onreadystatechange = () => {
        console.log("上传进度",xhr.upload)
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                alert(data.message);
                callback && callback();
                renderDownloadDom(file, document.getElementsByClassName("show-list")[0],data.filename);
            } else {
                alert("上传失败");
            }
        }
    };
}
downloadBtn.addEventListener("click", () => {
    download("/download", "get", "", { filename: "acf0ef5f4783340970a0c2793b03af56" });
});


function download(url, method, fileName, params) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("数据流",this.response,this == xhr)
            const blob = new Blob([this.response]);
            // 检验空文件
            let length = xhr.getResponseHeader("Content-Length");
            if (length == 0) {
                new Vue().$message({
                    type: "error",
                    message: "下载失败，文件不存在",
                });
                return;
            }
            let fileName4admin = xhr.getResponseHeader("Content-Disposition");
            console.log(fileName4admin);
            if (fileName4admin) {
                fileName = decodeURI(
                    fileName4admin.replace("attachment; filename=", "")
                );
            }
            fileName = fileName.slice(0, 1);
            fileName = fileName.slice(-1);
            if ("download" in document.createElement("a")) {
                // 非IE下载
                const elink = document.createElement("a");
                elink.download = fileName;
                //   elink.style.display = "none";
                elink.innerText = fileName;
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                //   document.body.removeChild(elink);
            } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
            }
        }
    };
    let paramsStr = "?";
    Object.keys(params).forEach((ele) => {
        paramsStr += `${ele}=${params[ele]}&`;
    });
    xhr.open(method, url + paramsStr.slice(0, -1));
    xhr.responseType = "blob";
    xhr.send(JSON.stringify(params));
}