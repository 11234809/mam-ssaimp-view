<template>
        <div>
            <div class="editor" ref="editor" :style="styles"></div>
        </div>
    </template>
    <script setup>
//     import { getToken } from "@/utils/auth";    // 自己存储token的文件
    import Quill from "quill";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import { onMounted, getCurrentInstance, ref, reactive, watch, computed, defineExpose } from "vue";
    
    let thisQuill;
    const { proxy } = getCurrentInstance();
    const props = defineProps({
        /* 编辑器的内容 */
        value: {
            type: String,
            default: "",
        },
        /* 高度 */
        height: {
            type: Number,
            default: null,
        },
        /* 最小高度 */
        minHeight: {
            type: Number,
            default: null,
        },
        /* 只读 */
        readOnly: {
            type: Boolean,
            default: false,
        },
        // 上传文件大小限制(MB)
        fileSize: {
            type: Number,
            default: 5,
        },
        /* 类型（base64格式、url格式） */
        type: {
            type: String,
            default: "url",
        },
    });
    // 如果使用两次，则把,"update:input1"添加到defineEmits里面
    const emit = defineEmits(["update:input", "update:on-change", "update:on-text-change", "update:on-selection-change", "update:on-editor-change"]);

    const currentValue = ref("");
    const options = reactive({
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
            // 工具栏配置
            toolbar: [
                ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                ["blockquote", "code-block"], // 引用    代码块
                [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                [{ indent: "-1" }, { indent: "+1" }], // 缩进
                [{ size: ["small", false, "large", "huge"] }], // 字体大小
                [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                [{ align: [] }], // 对齐方式
                ["clean"], // 清除文本格式
                // ["video", "image"], // 链接、图片、视频("video")
                // ['table'] // 添加表格按钮
            ],
        },
        placeholder: "请输入内容"
    });
    const editor = ref(null);
    const styles = computed(() => {
        let style = {};
        if (proxy.minHeight) {
            style.minHeight = `${proxy.minHeight}px`;
        }
        if (proxy.height) {
            style.height = `${proxy.height}px`;
        }
        return style;
    });

    const init = () => {
        const initEditor = proxy.$refs.editor;
        thisQuill = new Quill(initEditor, options);
        thisQuill.on("text-change", (delta, oldDelta, source) => {
            const html = proxy.$refs.editor.children[0].innerHTML;
            const text = thisQuill.getText();
            const quill = thisQuill;
            currentValue.value = html;
            emit("update:input", html);
            emit("update:on-change", { html, text, quill });
        });
        thisQuill.on("text-change", (delta, oldDelta, source) => {
            emit("update:on-text-change", delta, oldDelta, source);
        });
        thisQuill.on("selection-change", (range, oldRange, source) => {
            emit("update:on-selection-change", range, oldRange, source);
        });
        thisQuill.on("editor-change", (eventName, ...args) => {
            emit("update:on-editor-change", eventName, ...args);
        });
    };
    
    onMounted(() => {
        init();
        thisQuill.enable(!props.readOnly)
    });
    const refreshContent = (value) => {
        currentValue.value = value;
        thisQuill.pasteHTML(currentValue.value);
    };
    defineExpose({
        refreshContent,
    })
    </script>
    <style>
    .editor,
    .ql-toolbar {
        white-space: pre-wrap !important;
        line-height: normal !important;
    }
    .quill-img {
        display: none;
    }
    .ql-snow .ql-tooltip[data-mode="link"]::before {
        content: "请输入链接地址:";
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: "保存";
        padding-right: 0px;
    }
    
    .ql-snow .ql-tooltip[data-mode="video"]::before {
        content: "请输入视频地址:";
    }
    
    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: "14px";
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
        content: "10px";
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
        content: "18px";
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
        content: "32px";
    }
    
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: "文本";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: "标题1";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: "标题2";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: "标题3";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: "标题4";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: "标题5";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: "标题6";
    }
    
    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: "标准字体";
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
        content: "衬线字体";
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
        content: "等宽字体";
    }
    </style>