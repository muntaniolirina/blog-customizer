import clsx from 'clsx';
import { useState, useRef, type FormEvent } from 'react';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

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
	onApply: (articleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	// Состояние панели
	const [isOpen, setIsOpen] = useState(false);

	// Состояние формы
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);

	// Ссылки на элементы панели для отслеживания клика вне нее
	const sidebarRef = useRef<HTMLElement | null>(null);
	const arrowButtonRef = useRef<HTMLDivElement | null>(null);

	// Обработчики панели

	// Переключает состояние панели
	const toggleForm = () => {
		setIsOpen((previousValue) => !previousValue);
	};

	// Закрывает панель
	const closeForm = () => {
		setIsOpen(false);
	};

	// Закрывает панель при клике вне неё
	useClosePanelOnOutsideClick({
		isOpen,
		sidebarRef,
		arrowButtonRef,
		onClose: closeForm,
	});

	// Обработчики формы

	// Применяет настройки формы
	const handleApply = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		onApply(formState);
	};

	// Сбрасывает настройки формы
	const handleReset = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	// Создаёт обработчик для обновления указанного поля формы.
	// Получает имя поля и возвращает функцию,
	// которая принимает новое выбранное значение.
	const updateFormField = (field: keyof ArticleStateType) => {
		return (value: OptionType) => {
			setFormState((prevState) => ({
				...prevState,
				[field]: value,
			}));
		};
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				{/* Оборачиваем стрелку в div, чтобы отслеживать клики в её области */}
				<ArrowButton isOpen={isOpen} onClick={toggleForm} />
			</div>

			{/* При isOpen добавляется класс container_open */}
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={updateFormField('fontFamilyOption')}
					/>
					<RadioGroup
						name='font-size'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={updateFormField('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={updateFormField('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={updateFormField('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={updateFormField('contentWidth')}
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
