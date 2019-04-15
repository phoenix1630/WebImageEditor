/// <reference path="../../../scripts/jquery.js"/>
/// <reference path="../../../scripts/template3/ui/jquery-ui-partical.js"/>
/// <reference path="../../../scripts/template3/ui/jquery.ui.resizable.min.js"/>

var zIndexnum = 1;
var conobjContextmenu = function (e) {
    var ts = $(this), tsp = ts.parent();
    //    tsp.children(".active").removeClass("active");
    //    ts.addClass("active");
    e.stopPropagation();
    var c = $("#conobjContextmenu");
    if (c.length === 0) {
        c = $("<div id=conobjContextmenu class=modhtmlmenu />").appendTo("body");
        var target = tsp.children(".ActiveObj");
        $("<div><button>提升一层</button></div>").appendTo(c).click(function () {
            var NewIndex = parseInt(target.css("zIndex")) + 1;
            target.css({ zIndex: NewIndex });
            c.hide();
        });
        $("<div><button>下降一层</button></div>").appendTo(c).click(function () {
            var NewIndex = parseInt(target.css("zIndex")) - 1;
            if (NewIndex < 0) { NewIndex = 0; }
            target.css({ zIndex: NewIndex });
            c.hide();
        });
        $("<div><button>设置背景为白色</button></div>").appendTo(c).click(function () {
            target.css({ background: "#FFF" });
            c.hide();
        });
        $("<div><button>设置背景为透明</button></div>").appendTo(c).click(function () {
            target.css({ background: "transparent" });
            c.hide();
        });
        $("<div><button>删除</button></div>").appendTo(c).click(function () {
            target.remove();
            c.hide();
        });
    }
    c.css({ left: e.clientX, top: e.clientY, display: "block" });
    ts.data("menu", c);
    tsp.click(function () {
        c.hide();
    });
    return false;
}
var imgobjContextmenu = function (e) {
    var ts = $(this), tsp = ts.parent();
    tsp.children(".activeImg").removeClass("activeImg");
    ts.addClass("activeImg");
    e.stopPropagation();
    var c = $("#imgobjContextmenu");
    if (c.length === 0) {
        c = $("<div id=imgobjContextmenu class=modhtmlmenu />").appendTo("body");
        var target = tsp.children(".ActiveObj");
        $("<div><button>提升一层</button></div>").appendTo(c).click(function () {
            var NewIndex = parseInt(target.css("zIndex")) + 1;
            target.css({ zIndex: NewIndex });
            c.hide();
        });
        $("<div><button>下降一层</button></div>").appendTo(c).click(function () {
            var NewIndex = parseInt(target.css("zIndex")) - 1;
            if (NewIndex < 0) { NewIndex = 0; }
            target.css({ zIndex: NewIndex });
            c.hide();
        });
        $("<div><button>删除</button></div>").appendTo(c).click(function () {
            target.remove();
            c.hide();
        });
    }
    c.css({ left: e.clientX, top: e.clientY, display: "block" });
    tsp.click(function () {
        c.hide();
    });
    return false;
}
///以上为基础函数
$.fn.extend({
    imgeditor: function (width, height, IsReadOnly, title) {
        var t = $(this), to = t.position(), CodeObj = $(this);
        //t.hide();
        var myStyle = "width:" + width + "px;height:" + height + "px";
        var ImgEditorHtml = [];
        ImgEditorHtml.push("<span id=" + t.attr("id") + "_ImgEditor class=ImgEdit style='position:absolute;left:" + to.left + "px;top:" + to.top + "px;'>");
        //        ImgEditorHtml.push("  <div class=imgMask style='" + myStyle + ";line-height:" + height + "px;'>图片加载中</div>");
        //        ImgEditorHtml.push("  <img style='" + myStyle + ";' src='/Content/images/nopic.gif' />");
        ImgEditorHtml.push("  <div class=title>" + title + "</div>");
        ImgEditorHtml.push("  <div class=SimpleEditorContent style='position:relative;'><img style='" + myStyle + ";' src='" + t.val() + "' /></div>");
        if (IsReadOnly != true) {
            ImgEditorHtml.push("  <a href='javascript:void(0)' class=ImgEditBegin>编辑</a>");
        }
        ImgEditorHtml.push("</span>");
        var oeditor = $(ImgEditorHtml.join("")).insertAfter(t);
        oeditor.draggable();
        var oi = oeditor.find("img");
        //var om = oeditor.children(".imgMask");
        //var oi = oeditor.children("img").error(function () { oi.attr("src", "/Content/images/nopic.gif"); }).load(function () { om.hide(); });
        //绑定行切换时改变对应的图片路径
        //        if (window.afterGetFirst_ImgEditor === undefined) { window.afterGetFirst_ImgEditor = []; }
        FuncListAfterGetFirst.push(function () {
            //alert(t.val() + "&dt=" + new Date().getMilliseconds());
            oi.attr("src", t.val() + "&dt=" + new Date().getMilliseconds());
            //om.show();
        });
        //图片编辑器
        oeditor.find(".ImgEditBegin").click(function (e) {
            //开始编辑状态后，禁止下面的热键行切换
            window.isChangeRowActive = false;
            ///////////////////////////////////
            var code = [];
            code.push("<div id=\"" + t.attr("id") + "_modhtml\" tabIndex=1 class=\"modhtml\" style='width:" + width + "px;height:" + height + "px;'></div>");
            code.push("<div class=attr-here></div>");
            code.push("<button class=\"btn determine\" style=\"vertical-align: -30%; margin-left: 12px;\">确定</button>");
            var editor = $.SimpleImgEditorMask(code.join("")).find(".modhtml");
            //alert(editor.html());
            //editor.blur(function () { CodeObj.val(editor.html()); });
            ///还原
            var CodeObjVal = CodeObj.val();
            if (CodeObjVal != "") {
                if (CodeObjVal != "数据载入中...") {
                    if (CodeObjVal.indexOf("idd=") != -1) {
                        $.post("/UserOperation/ImgEdit_GetCode/", "idd=" + CodeObjVal.split("idd=")[1].split("&")[0], function (TheXml) {
                            var InitJson = eval("(" + TheXml + ")");
                            for (var i = 0; i < InitJson.Items.length; i++) {
                                var CurrJson = InitJson.Items[i];
                                if (CurrJson.type == "text") {
                                    $("<div class=textType style='z-index:" + CurrJson.zIndex + ";position:absolute;left:" + CurrJson.left + "px;top:" + CurrJson.top + "px;font-size:" + CurrJson.FontSize + ";'>" + CurrJson.text + "</div>").appendTo(editor);
                                } else {
                                    $("<div class=imgType style='z-index:" + CurrJson.zIndex + ";position:absolute;left:" + CurrJson.left + "px;top:" + CurrJson.top + "px;width:" + CurrJson.width + "px;height:" + CurrJson.height + "px;'><img style='width:" + CurrJson.width + "px;height:" + CurrJson.height + "px;' src='" + CurrJson.src + "' /></div>").appendTo(editor);
                                }
                            }
                            editor.attr("IdKey", InitJson.IdKey);
                            ///初始化文本图片框的action
                            editor.find(".textType").imgeditor_textProcess();
                            editor.find(".imgType").ImgEditor_ImgProcess();
                        });
                    }
                } else { alert("数据载入中...请等待载入完毕后再进行编辑"); return false; }
            }
            ///初始化确定按钮
            editor.siblings(".determine").click(function () {
                //t.html(editor.html());
                var Items = [];
                editor.find(".textType,.imgType").each(function () {
                    var tse = $(this), tseo = tse.position();
                    if (tse.hasClass("textType")) {
                        Items.push({ type: "text", zIndex: tse.css("zIndex"), left: tseo.left, top: tseo.top, width: tse.width(), height: tse.height(), text: tse.html(), FontSize: tse.css("font-size") });
                    } else {
                        Items.push({ type: "img", zIndex: tse.css("zIndex"), left: tseo.left, top: tseo.top, width: tse.width(), height: tse.height(), src: tse.find("img").attr("src") });
                    }
                });
                var json = {
                    Items: Items,
                    width: width,
                    height: height,
                    IdKey: editor.attr("IdKey")
                };
                //alert(editor.attr("IdKey"));
                if (json.IdKey == undefined) { json.IdKey = 0; }
                //CodeObj.val($.jsonToStr(json));
                var PostJson = { ImgCode: encodeURIComponent($.jsonToStr(json)), IdKey: json.IdKey };
                $.post("/UserOperation/ImgEdit_SaveCode/", PostJson, function (xml) {
                    if (typeof callback !== "undefined") callback.apply(t, [xml]);
                    oi.attr("src", "/UserOperation/ImgEdit_ShowImg/?idd=" + xml + "&dt=" + new Date().getMilliseconds());
                    CodeObj.val("/UserOperation/ImgEdit_ShowImg/?idd=" + xml);
                    if (window.pageObject.isEdit !== true) { BtnList.mods.click(); }
                    $.SimpleImgEditorMask("", false);
                    //开始编辑状态后，开启下面的热键行切换
                    window.isChangeRowActive = true;
                });
            });
            //右键菜单
            editor.bind("contextmenu", function (e) {
                var t = $(this);
                ///主右键菜单
                var o = $("#modhtmlmenu");
                if (o.length === 0) {
                    o = $("<div id=modhtmlmenu class=modhtmlmenu />").appendTo("body");
                    var textObj = $("<div><button>添加文字</button></div>").appendTo(o);
                    textObj.bind("click", function () {
                        var co = $("<div class=textType style='z-index:" + zIndexnum + ";position:absolute'>请输入你想要写的文字</div>").appendTo(o.data("o"));
                        co.draggable();
                        co.imgeditor_textProcess();
                        o.hide();
                    });
                    $("<div><button>添加图片</button></div>").appendTo(o).click(function (e) {
                        var ts = $(this);

                        ts.UploadV2({
                            load: function (ChildWindow, TheIframe, UploadPanel) {
                            }, UploadFinish: function (FilePath, ChildWindow, TheIframe, UploadPanel) {
                                //alert(FilePath);
                                var co = $("<div class=imgType style='z-index:" + zIndexnum + ";position:absolute;'><img class=activeImg src='" + FilePath + "' /></div>").appendTo(o.data("o"));
                                zIndexnum++;
                                co.ImgEditor_ImgProcess();
                            }
                        });
                        o.hide();
                    });
                }
                o.data("o", t);
                o.css({ left: e.clientX, top: e.clientY, display: "block" });
                t.click(function () { o.hide(); });
                return false;
            });
        });
        return t;
    }
});
$.fn.extend({
    imgeditor_textProcess: function () {
        $(this).each(function () {
            var ts = $(this), tsp = ts.parent();
            ts.draggable();
            ts.bind("contextmenu", conobjContextmenu);
            tsp.click(function () { tsp.find(".ActiveObj").removeClass("ActiveObj"); });
            ts.click(function (e) { e.stopPropagation(); });
            ts.mousedown(function (e) {
                e.stopPropagation();
                ts.siblings(".ActiveObj").removeClass("ActiveObj");
                ts.addClass("ActiveObj");
            })
                .dblclick(function () {
                    var ts1 = $(this), ts1o = ts1.offset();
                    var ImgEditorTextEdit = $("#ImgEditorTextEdit");
                    if (ImgEditorTextEdit.size() === 0) {
                        var HTML = [];
                        HTML.push("<div id=ImgEditorTextEdit style='position:absolute;z-index:9;border:solid 1px #333;background:#FFF;padding:8px;'>");
                        HTML.push("  <textarea></textarea><br />");
                        HTML.push("  <button class=Determine>确定</button>");
                        HTML.push("  <button onclick=$(this).parent().remove();>取消</button>");
                        HTML.push("</div>");
                        ImgEditorTextEdit = $(HTML.join("")).appendTo("body");
                        ImgEditorTextEdit.find(".Determine").click(function () {
                            ts.html(ImgEditorTextEdit.find("textarea").val().replace(/\ /img, "&nbsp;").replace(/\n/img, "<br>"));
                            ImgEditorTextEdit.remove();
                        });
                    }
                    ImgEditorTextEdit.find("textarea").val(ts.html().replace(/&nbsp;/img, " ").replace(/<br>/img, "\n"));
                    ImgEditorTextEdit.css({ left: ts1o.left, top: ts1o.top + 18 });
                });
            ts.mouseup(function () {
                var HTML = [];
                HTML.push("<div>");
                HTML.push("  大小<input type=text class=font-size value=12 />px<br>");
                HTML.push("  层数<input type=text class=z-index value=0 />");
                HTML.push("<div>");
                var o = tsp.siblings(".attr-here").html(HTML.join(""));
                o.find(".font-size").change(function () {
                    ts.css({ "font-size": $(this).val() + "px" });
                }).keydown(function (e) { if (e.keyCode === 13) { $(this).change(); } }).val(parseInt($(this).css("font-size")));
            });
            if (ts.data("menu")) ts.data("menu").remove();
            zIndexnum++;
        });
    },
    ImgEditor_ImgProcess: function (e) {
        $(this).each(function () {
            var t = $(this);
            var ts = $(this).children("img"), tsp = $(this).parent();
            t.draggable();
            t.resizable({
                resize: function () {
                    ts.width(t.width());
                    ts.height(t.height());
                }
            });

            tsp.click(function () { tsp.find(".ActiveObj").removeClass("ActiveObj"); });
            t.click(function (e) { e.stopPropagation(); });
            t.mousedown(function (e) {
                e.stopPropagation();
                t.siblings(".ActiveObj").removeClass("ActiveObj");
                t.addClass("ActiveObj");
            });
            t.bind("contextmenu", imgobjContextmenu);
            t.mouseup(function (e) {
                var Html = [];
                Html.push("<div class=changesizebox>");
                Html.push("  &nbsp;大小<input type=text class=w />*<input type=text class=h />px");
                Html.push("  <div style='line-height:22px;'>");
                Html.push("    <label><input class=fit-width type=radio name=img-fix />适合宽度</label>");
                Html.push("    <label><input class=fit-height type=radio name=img-fix />适合高度</label>");
                Html.push("    <label><input class=fit-original type=radio name=img-fix />原始尺寸</label>");
                Html.push("  </div>");
                Html.push("  层数<input type=text class=z-index value=0 />");
                Html.push("</div>");
                var o = tsp.siblings(".attr-here").html(Html.join(""));
                var w = o.find(".w"), h = o.find(".h");
                w.add(h).change(function () {
                    ts.width(parseInt(w.val()));
                    ts.height(parseInt(h.val()));
                });
                o.find(".fit-width").click(function () { ts.add(t).width(tsp.width()); ts.add(t).height(""); t.mouseup(); });
                o.find(".fit-height").click(function () { ts.add(t).height(tsp.height()); ts.add(t).width(""); t.mouseup(); });
                o.find(".fit-original").click(function () { ts.add(t).height(""); ts.add(t).width(""); t.mouseup(); });
                w.val(t.width());
                h.val(t.height());
            });
        });
    }
});
$.extend({
    SimpleImgEditorMask: function (str, showorhide) {
        for (var i = 0; i < arguments.length; i++) {

        }
        var box = $("#SimpleImgEditorMask");
        var boxMess = $("#SimpleImgEditorMask_Message");
        if (showorhide === false) {
            boxMess.children(".content").html(str); box.hide(); boxMess.hide();
        }
        else {
            if (box.size() === 0) {
                box = $("<div id=SimpleImgEditorMask class=SimpleImgEditorMask></div>").appendTo("body").css("opacity", 0.6);
                boxMess = $("<div id=SimpleImgEditorMask_Message class=SimpleImgEditorMask_Message><div class=CloseMask>x</div><div class=content></div></div>").appendTo("body");
                boxMess.children(".CloseMask").click(function () { box.hide(); boxMess.hide(); });
            }
            boxMess.children(".content").html(str);
            box.show();
            boxMess.show();
            var resizeBoxChildren = function () {
                var wins = $(window);
                var cl = (wins.width() - boxMess.width()) / 2;
                var ct = (wins.height() - boxMess.height()) / 2;
                boxMess.css({ top: ct, left: cl });
            }
            var boxImg = boxMess.find("img");
            if (boxImg.size() == 0) {
                resizeBoxChildren();
            }
            else {
                boxImg.load(function () { resizeBoxChildren(); });
            }

        }
        return boxMess;
    }
});
$("<link href=\"/UserControls/imgEditor/V2/imgeditor.css\" rel=\"Stylesheet\" type=\"text/css\" />").appendTo("head");
if (typeof imgSimpleEditorJson !== "undefined") {
    for (var v in imgSimpleEditorJson) {
        var ImgEditJson = imgSimpleEditorJson[v];
        $("#" + ImgEditJson.codeobj).imgeditor(ImgEditJson.width, ImgEditJson.height, ImgEditJson.IsReadOnly, ImgEditJson.title);

    }
}
if (window.UploadVersion2IsLoad === undefined) {
    $("<script type=text/javascript src='/UserControls/upload/Version2/UploadV2.js'></script>").appendTo("head");
    $("<script type=text/javascript src='/Scripts/Template3/ui/jquery.ui.resizable.min.js'></script>").appendTo("head");
    $("<link href=\"/Scripts/Template2/themes/base/jquery.ui.all.css\" rel=\"stylesheet\" type=\"text/css\" />").appendTo("head");
    //$("<link href=\"/Scripts/Template2/themes/base/jquery.ui.base.css\" rel=\"stylesheet\" type=\"text/css\" />").appendTo("head");
    //$("<link href=\"/Scripts/Template2/themes/base/jquery.ui.theme.css\" rel=\"stylesheet\" type=\"text/css\" />").appendTo("head");
    //$("<link href=\"/Scripts/Template2/themes/base/jquery.ui.core.css\" rel=\"stylesheet\" type=\"text/css\" />").appendTo("head");
    //$("<link href=\"/Scripts/Template2/themes/base/jquery.ui.resizable.css\" rel=\"stylesheet\" type=\"text/css\" />").appendTo("head");
}