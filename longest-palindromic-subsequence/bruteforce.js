function main(str) {

	const symbols = str.split('');

	// Для каждой буквы находим все индексы (для быстрого последующего получения без поиска по строке)
	const indexes = getIndexes(symbols);

	// Рекурсивно ищем полиндромы в подстроках (можно получать подстроки через slice, но это лишний проход по строке. Достаточно начального и конечного индекса
	return getSubPalindrom(symbols, indexes, { start: 0, end: symbols.length }).length;

}

function getIndexes(symbols) {

	const indexes = {};

	symbols.forEach((symb, i) => {

		if (!(indexes[symb] instanceof Array)) indexes[symb] = [];

		indexes[symb].push(i);

	});

	return indexes;

}

function getSubPalindrom(arr, indexes, { start, end }) {

	if (end <= start) return '';

	const symb = arr[start];

	// Для текущей буквы можно выбрать - брать ее в итоговый полиндром или нет. Например в строке aabccb выгоднее не брать a (aa < bccb).

	// Если не берем текущую букву, то просто заходим дальше в рекурсию и возвращаем полиндром данной подстроки без первого (текущего) символа. 
	const polindrom2 = getSubPalindrom(arr, indexes, { start: start + 1, end });

	// Если берем, то возможны 2 варианта - для символа есть пара или ее нет. Ищем ее в индексах. Искомый индекс не должен выходить за рамки подстроки.
	const lastSameSymbIndex = findLast(indexes[symb], { start, end, current: start });

	// Выбранная пара индексов - начало и конец новой подстроки для поиска полиндрома.
	// Если пары нет, то очевидно, что дальше строить полиндром не получится и тогда этот символ - середина исходного полиндрома.
	const polindrom1 = (
		lastSameSymbIndex !== -1
		? symb + getSubPalindrom(arr, indexes, { start: start + 1, end: lastSameSymbIndex }) + symb
		: symb
	);

	return (polindrom2.length > polindrom1.length ? polindrom2 : polindrom1);

}

function findLast(arr, { start, end, current }) {

	// Имеет смысл взять самый крайний индекс. Это нужно, чтобы увеличить размер следующей подстроки. 
	// Например при поиске пары для первой a в строке acabba при взятии не самого крайнего индекса (последняя a) мы пропустим bb, получив полиндром aca вместо abba.
	return arr.filter((i) => i < end && i > start && i > current).at(-1) || -1;

}

console.log(main('abbabb')); // bbabb