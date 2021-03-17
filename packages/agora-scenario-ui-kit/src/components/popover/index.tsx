import * as React from 'react';
import { Tooltip, AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import {
  getRenderPropValue,
  RenderFunction,
} from '../_util/getRenderPropValue';
import { getTransitionName } from '../_util/motion';
import './index.css';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
}

export const Popover = React.forwardRef<unknown, PopoverProps>(
  (
    { prefixCls: customizePrefixCls, title, content, ...otherProps } = {
      placement: 'top' as TooltipPlacement,
      trigger: 'hover',
      mouseEnterDelay: 0.01,
      mouseLeaveDelay: 0.01,
      overlayStyle: {},
    },
    ref,
  ) => {
    const getOverlay = (prefixCls: string) => (
      <>
        {title && (
          <div className={`${prefixCls}-title`}>
            {getRenderPropValue(title)}
          </div>
        )}
        <div className={`${prefixCls}-inner-content`}>
          {getRenderPropValue(content)}
        </div>
      </>
    );

    const prefixCls = customizePrefixCls ?? 'popover';
    const rootPrefixCls = 'root-popover';

    return (
      <Tooltip
        {...otherProps}
        prefixCls={prefixCls}
        ref={ref as any}
        overlay={getOverlay(prefixCls)}
        transitionName={getTransitionName(
          rootPrefixCls,
          'zoom-big',
          otherProps.transitionName,
        )}
      />
    );
  },
);