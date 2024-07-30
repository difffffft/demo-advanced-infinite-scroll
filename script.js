// 选择菜单元素和菜单项元素
const menuElement = document.querySelector(".menu");
const menuItemElements = document.querySelectorAll(".menu-item");
let menuElementHeight = menuElement.clientHeight;
let menuItemHeight = menuItemElements[0].clientHeight;
let totalMenuHeight = menuItemElements.length * menuItemHeight;

let currentScrollPosition = 0;
let lastScrollY = 0;
let smoothScrollY = 0;

// 插值函数,用于平滑过渡
const interpolate = (start, end, factor) => start * (1 - factor) + end * factor;

// 调整菜单项位置的函数
const adjustMenuItemsPosition = (scroll) => {
  gsap.set(menuItemElements, {
    y: (index) => index * menuItemHeight + scroll,
    modifiers: {
      y: (y) => {
        // 使用gsap的wrap函数实现循环滚动效果
        const wrappedY = gsap.utils.wrap(
          -menuItemHeight,
          totalMenuHeight - menuItemHeight,
          parseInt(y)
        );
        return `${wrappedY}px`;
      },
    },
  });
};
adjustMenuItemsPosition(0);

// 鼠标滚轮事件处理函数
const onWheelScroll = (event) => {
  currentScrollPosition -= event.deltaY;
};

let startY = 0;
let currentY = 0;
let isDragging = false;

// 拖动开始事件处理函数
const onDragStart = (event) => {
  startY = event.clientY || event.touches[0].clientY;
  isDragging = true;
  menuElement.classList.add("is-dragging");
};

// 拖动移动事件处理函数
const onDragMove = (event) => {
  if (!isDragging) return;
  currentY = event.clientY || event.touches[0].clientY;
  currentScrollPosition += (currentY - startY) * 3;
  startY = currentY;
};

// 拖动结束事件处理函数
const onDragEnd = () => {
  isDragging = false;
  menuElement.classList.remove("is-dragging");
};

// 动画循环函数
const animate = () => {
  requestAnimationFrame(animate);
  // 使用插值函数实现平滑滚动
  smoothScrollY = interpolate(smoothScrollY, currentScrollPosition, 0.1);

  // 平滑滚动
  adjustMenuItemsPosition(smoothScrollY);

  const scrollSpeed = smoothScrollY - lastScrollY;
  lastScrollY = smoothScrollY;

  // 根据滚动速度调整菜单项的缩放和旋转
  gsap.to(menuItemElements, {
    scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.0075,
    rotate: scrollSpeed * 0.2,
  });
};
animate();

// 添加各种事件监听器
menuElement.addEventListener("mousewheel", onWheelScroll);
menuElement.addEventListener("touchstart", onDragStart);
menuElement.addEventListener("touchmove", onDragMove);
menuElement.addEventListener("touchend", onDragEnd);
menuElement.addEventListener("mousedown", onDragStart);
menuElement.addEventListener("mousemove", onDragMove);
menuElement.addEventListener("mouseleave", onDragEnd);
menuElement.addEventListener("mouseup", onDragEnd);
menuElement.addEventListener("selectstart", () => false);

// 窗口大小改变时更新尺寸
window.addEventListener("resize", () => {
  menuElementHeight = menuElement.clientHeight;
  menuItemHeight = menuItemElements[0].clientHeight;
  totalMenuHeight = menuItemElements.length * menuItemHeight;
});
