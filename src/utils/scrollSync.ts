const scrollSync = () => {
  const elements = [...document.querySelectorAll('.scroll-sync')];

  const syncScroll = (scrolledEle: HTMLElement, ele: Element) => {
    const scrolledPercent =
      scrolledEle.scrollTop /
      (scrolledEle.scrollHeight - scrolledEle.clientHeight);
    const top = scrolledPercent * (ele.scrollHeight - ele.clientHeight);

    const scrolledWidthPercent =
      scrolledEle.scrollLeft /
      (scrolledEle.scrollWidth - scrolledEle.clientWidth);
    const left = scrolledWidthPercent * (ele.scrollWidth - ele.clientWidth);

    ele.scrollTo({
      behavior: 'instant',
      top,
      left,
    });
  };

  const handleScroll = (e: Event) => {
    new Promise((resolve) => {
      requestAnimationFrame(() => resolve(''));
    });
    const scrolledEle = e.target as HTMLElement;
    elements
      .filter((item) => item !== scrolledEle)
      .forEach((ele) => {
        ele.removeEventListener('scroll', handleScroll);
        syncScroll(scrolledEle, ele);
        window.requestAnimationFrame(() => {
          ele.addEventListener('scroll', handleScroll);
        });
      });
  };

  elements.forEach((ele) => {
    ele.addEventListener('scroll', handleScroll);
  });
};

export default scrollSync;
