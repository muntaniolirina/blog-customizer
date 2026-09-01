import clsx from 'clsx';
import { useState, useRef, type FormEvent } from 'react';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

import type { OptionType, ArticleStateType } from 'src/constants/articleProps';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';

import { useClosePanelOnOutsideClick } from './hooks/useClosePanelOnOutsideClick';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	isOpen: boolean;
	onToggle: () => void;
	onApply: (articleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	isOpen,
	onToggle,
	onApply,
}: ArticleParamsFormProps) => {
	// ссылка на <aside> - для отслеживания клика вне области
	const sidebarRef = useRef<HTMLElement | null>(null);
	// ссылка на область со стрелкой - для отслеживания клика вне области
	const arrowButtonRef = useRef<HTMLDivElement | null>(null);

	// Закрываем панель при клике вне панели и кнопки-стрелки
	useClosePanelOnOutsideClick({
		isOpen,
		sidebarRef,
		arrowButtonRef,
		onClose: onToggle,
	});

	// --- СОСТОЯНИЯ---
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);

	// --- ОБРАБОТЧИКИ---

	//обработчик нажатия на кнопку применения
	const handleApply = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		onApply(formState);
	};

	//обработчик нажатия на кнопку сброса
	const handleReset = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	// универсальный обработчик изменения любой настройки формы
	// key — имя поля в состоянии formState. option — новое выбранное значение.
	// Обновляем только указанное поле, сохраняя остальные настройки.
	const handleOptionChange = (
		key: keyof ArticleStateType,
		option: OptionType
	) => {
		setFormState((prevState) => {
			return {
				// копируем предыдущее состояние
				...prevState,
				// обновляем только поле, имя которого передано в key.
				[key]: option,
			};
		});
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				{/* обернули стрелку в div чтобы отслеживать клики в ее области */}
				<ArrowButton isOpen={isOpen} onClick={onToggle} />
			</div>

			{/* если isOpen true, дополнительно добавится класс container_open */}
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) =>
							handleOptionChange('fontFamilyOption', option)
						}
					/>
					<RadioGroup
						name='font-size'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => handleOptionChange('fontSizeOption', option)}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => handleOptionChange('fontColor', option)}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => handleOptionChange('backgroundColor', option)}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(option) => handleOptionChange('contentWidth', option)}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
