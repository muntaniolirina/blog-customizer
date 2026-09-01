import { useState, type CSSProperties } from 'react';
import clsx from 'clsx';

import { Article } from '../article/Article';
import { ArticleParamsForm } from '../article-params-form/ArticleParamsForm';
import { defaultArticleState } from 'src/constants/articleProps';

import styles from './app.module.scss';

export const App = () => {
	// состояние панели
	const [isOpen, setOpen] = useState(false);

	// состояние параметров статьи
	const [articleState, setArticleState] = useState(defaultArticleState);

	// функция для открытия/закрытия панели
	const toggleForm = () => {
		setOpen((previousValue) => !previousValue);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				isOpen={isOpen}
				onToggle={toggleForm}
				onApply={setArticleState}
			/>
			<Article />
		</main>
	);
};
