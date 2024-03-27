import DialogBox from './DialogBox.vue';
import { createApp, Suspense } from 'vue';
const container = document.createElement('div');
document.body.appendChild(container);
DialogBox.show = (props: any, callback1: Function, callback2: Function) => {
  const DialogBoxDom = document.createElement('div');

  const cancel = () => {
    typeof callback1 === 'function' && callback1();
    dialogBox.unmount();
    DialogBoxDom.remove();
  };
  const confirm = () => {
    typeof callback2 === 'function' && callback2();
    dialogBox.unmount();
    DialogBoxDom.remove();
  };
  const dialogBox = createApp(DialogBox, {
    ...props,
    cancel,
    confirm
  });
  const open = () => {
    dialogBox.mount(DialogBoxDom);
    container.appendChild(DialogBoxDom);
  };
  open();
};

export default DialogBox;
