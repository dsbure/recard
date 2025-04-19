import { useFloating, autoUpdate, arrow, offset, useTransitionStyles, OpenChangeReason, FloatingArrow, shift } from '@floating-ui/react';
import { } from '@ionic/react';
import { Ref, useMemo, useRef, useState } from 'react';

export interface IPopperProps {
	children: React.ReactNode,
	isOpen: boolean,
	setIsOpen: (open: boolean, event?: Event | undefined, reason?: OpenChangeReason | undefined) => void,
}
const Popover: React.FC<{ refs: any, styles: any, children: React.ReactNode }> = ({ children, refs, styles }) => <div className="pop-over" ref={refs.setFloating} style={styles}>{children}</div>

// isthis a ho;ok>?>???
export function usePopper({ children, isOpen, setIsOpen }: IPopperProps) {
	const arrowRef = useRef(null);
	const { refs, floatingStyles, context } = useFloating({
		whileElementsMounted: autoUpdate,
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [
			shift(),
			arrow({
				element: arrowRef,
			}),
			offset(10)
		],
	});
	const { isMounted, styles } = useTransitionStyles(context);

	const popover = isMounted ? <div className="pop-over-container" style={styles}>
			<Popover refs={refs} styles={floatingStyles}>
				{children}
				<FloatingArrow ref={arrowRef} context={context} tipRadius={2} height={8}/>
			</Popover>
		  </div> : <></>
	return (useMemo(() => {
		return {popover, refs}
	}, [popover, refs]));
}
