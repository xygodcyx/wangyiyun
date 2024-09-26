import AlertBox from './AlertBox.vue';
import { createApp } from 'vue';
const container = document.createElement('div');
document.body.appendChild(container);
AlertBox.alert = (props: any, callback: Function) => {
  const alertBoxDom = document.createElement('div');
  setTimeout(() => {
    close();
  }, props.duration);
  const close = () => {
    alertBox.unmount();
    alertBoxDom.remove();
    typeof callback === 'function' && callback();
  };
  const alertBox = createApp(AlertBox, {
    ...props,
    close
  });
  const open = () => {
    alertBox.mount(alertBoxDom);
    container.appendChild(alertBoxDom);
  };
  open();
};

export default AlertBox;
