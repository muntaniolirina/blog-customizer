import { useEffect, type RefObject } from 'react';

// Хук, который закрывает панель при клике во внешнюю область

type Props = {
	isOpen: boolean;
	sidebarRef: RefObject<HTMLElement | null>;
	arrowButtonRef: RefObject<HTMLDivElement | null>;
	onClose: () => void;
};

export const useClosePanelOnOutsideClick = ({
	isOpen,
	sidebarRef,
	arrowButtonRef,
	onClose,
}: Props) => {
	useEffect(() => {
		if (isOpen === false) {
			return;
		}

		// функция для обработки клика вне панели
		const handleOutsideClick = (e: MouseEvent) => {
			// получаем элемент, по которому кликнули
			const target = e.target;

			// проверяем, что target является DOM-узлом
			if (!(target instanceof Node)) {
				return;
			}
			// если кликнули внутри панели - выходим из функции
			if (sidebarRef.current?.contains(target)) {
				return;
			}
			// если кликнули внутри стрелки - выходим из функции
			if (arrowButtonRef.current?.contains(target)) {
				return;
			}
			// если кликнули вне панели и стрелки - закрываем панель
			onClose();
		};

		// начинаем слушать нажатия мыши на документе
		document.addEventListener('mousedown', handleOutsideClick);

		// функция очистки - удаляем слушатель при закрытии панели или размонтировании компонента
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen, sidebarRef, arrowButtonRef, onClose]);
};
