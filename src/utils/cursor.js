// 定义全局变量 mainCursor 用于存储主游标的实例
let mainCursor;

// 添加线性插值函数至 Math 对象，用于平滑动画效果
Math.lerp = (a, b, n) => (1 - n) * a + n * b;

// 获取元素样式属性的辅助函数，兼容不同浏览器
const getStyle = (el, attr) => {
  try {
    return window.getComputedStyle ? window.getComputedStyle(el)[attr] : el.currentStyle[attr];
  } catch (e) {
    console.error(e);
  }
  return false;
};

// 初始化并返回主游标实例
const cursorInit = () => {
  mainCursor = new Cursor();
  return mainCursor;
};

// 定义游标类，管理自定义游标的创建、初始化和渲染
class Cursor {
  constructor() {
    this.pos = { curr: null, prev: null }; // 当前和上一个位置坐标
    this.pt = []; // 存储具有指针样式的元素
    this.create(); // 创建游标元素
    this.init(); // 初始化事件监听器
    this.render(); // 开始渲染循环
  }

  // 更新游标的位置
  move(left, top) {
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  // 创建自定义游标 DOM 元素，并设置默认样式和行为
  create() {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden", "hidden");
      document.body.append(this.cursor);
    }

    // 收集所有具有 'pointer' 样式的元素
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
      if (getStyle(elements[i], "cursor") === "pointer") this.pt.push(elements[i].outerHTML);
    }

    // 添加自定义游标样式到页面
    this.scr = document.createElement("style");
    document.body.appendChild(this.scr);
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important}`;
  }

  // 刷新游标状态，重置位置和样式，并重新创建游标
  refresh() {
    this.scr.remove();
    this.cursor.classList.remove("active");
    this.pos = { curr: null, prev: null };
    this.pt = [];
    this.create();
    this.init();
    this.render();
  }

  // 初始化鼠标事件监听器
  init() {
    document.onmousemove = (e) => {
      if (this.pos.curr == null) this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 };
      this.cursor.classList.remove("hidden");
    };

    document.onmouseenter = () => this.cursor.classList.remove("hidden");
    document.onmouseleave = () => this.cursor.classList.add("hidden");
    document.onmousedown = () => this.cursor.classList.add("active");
    document.onmouseup = () => this.cursor.classList.remove("active");
  }

  // 渲染循环，更新游标位置以实现平滑移动效果
  render() {
    if (this.pos.prev) {
      this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    requestAnimationFrame(() => this.render());
  }
}

// 默认导出游标初始化函数
export default cursorInit;