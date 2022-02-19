```tsx
import { Modal, ModalProps } from 'antd';
import React, { ReactNode, useState } from 'react';

export interface UseModalOptions extends ModalProps {
  content?: ReactNode;
  onOk?: () => Promise<any>;
}

export const useModal = ({ content, onOk, ...modalProps }: UseModalOptions) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const modal = (
    <Modal
      visible={visible}
      onOk={async () => {
        if (onOk) {
          setLoading(true);
          await onOk();
          setLoading(false);
        }
        setVisible(false);
      }}
      onCancel={() => setVisible(false)}
      confirmLoading={loading}
      {...modalProps}
    >
      {content}
    </Modal>
  );

  return {
    visible,
    setVisible,
    modal,
  };
};
```
