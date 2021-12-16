import { FC } from 'react';
import classnames from 'classnames';
import './index.css';
import { SvgImg } from '~ui-kit';
import { AutoSizer } from 'react-virtualized';

type ModalProps = {
  title: string;
  closable: boolean;
  minHeight?: number;
  minWidth?: number;
  onCancel: () => void;
  onResize: ({ width, height }: { width: number; height: number }) => void;
};

export const Modal: FC<ModalProps> = ({
  title,
  closable,
  onCancel,
  onResize,
  minHeight,
  minWidth,
  children,
}) => {
  const cls = classnames('modal', 'relative');

  const contentCls = classnames('modal-content');

  return (
    <div className={cls} style={{ minHeight, minWidth }}>
      <AutoSizer onResize={onResize}>
        {() => <div className="w-full h-full absolute" style={{ zIndex: -1 }} />}
      </AutoSizer>
      <div className="modal-title">
        <div className="modal-title-text">{title}</div>
        {closable ? (
          <div className="modal-title-close" onClick={onCancel}>
            <SvgImg type="close" size={20} style={{ color: '#586376' }} />
          </div>
        ) : null}
      </div>
      <div className={contentCls}>{children}</div>
    </div>
  );
};