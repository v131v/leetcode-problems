/*

Наборы индексов составляются для получения ближайшего индекса искомой буквы слева и справа.
Напрмер для строки abcdb массив левых индексов для b - [-1, 1, 1, 1, 4], правых - [1, 1, 4, 4, 4].
Таким образом можно за O(1) получить ближайшую букву b слева/справа от, например, d.

Подстроку s[i, j] (от i до j) можно воспринимать как s[i] + s[i+1, j] или s[i, j-1] + s[j].
Если для подстрок s[i+1, j] и s[i, j-1] известна максимальная длина палиндрома, то мы сможем получить максимальную длину палиндрома для s[i, j].
Новый символ (s[i]/s[j]) может не входить в результирующий палиндром, тогда для строки s[i] + s[i+1, j] максимальный палиндром будет такой же, как и для s[i+1, j].
Новый символ s[i] может иметь пару в подстроке s[i+1, j] и входить в результирующий палиндром. 
Чтобы получить индекс пары k для s[i] нужно взять индекс первого вхождения этого символа слева от конца подстроки (j).
Максимальная длина палиндрома для s[i, k] равна максимальной длине палиндрома для s[i+1, k-1] + 2 (сами символы s[i] и s[k] идут в итоговый палиндром)
Из всех вариантов:
(s[i] + s[i+1, j], s[i] не идет в итоговый палиндром),
(s[i] + s[i+1, j], s[i] идет в итоговый палиндром),
(s[i, j-1] + s[j], s[i] не идет в итоговый палиндром),
(s[i, j-1] + s[j], s[i] идет в итоговый палиндром)
выбираем самый длинный. Это и будет ответ для подстроки s[i, j].

Реализация с помощью динамического программирования за O(s.length**2) времени

*/

function main(str) {

	const arr = str.split('');
	const indexes = getIndexes(arr);

	const dpPalindroms = getPalindroms(arr, indexes);

	return dpPalindroms[0][arr.length-1];

}

function getIndexes(arr) {

	const indexes = {};

	arr.forEach((symb, i) => {

		if (!indexes[symb]) indexes[symb] = new Array(arr.length).fill(0).map(() => ({ left: -1, right: -1 }));

		indexes[symb][i] = {
			left: i,
			right: i,
		};

	});

	for (const symb of Object.keys(indexes)) {

		let cur = -1;

		for (let i = 0; i < indexes[symb].length; i++) {

			if (indexes[symb][i].left !== -1) cur = indexes[symb][i].left;

			indexes[symb][i].left = cur;

		}

		cur = -1;

		for (let i = indexes[symb].length - 1; i >= 0; i--) {

			if (indexes[symb][i].right !== -1) cur = indexes[symb][i].right;
			
			indexes[symb][i].right = cur;

		}

	}

	return indexes;

}

function getPalindroms(arr, indexes) {

	const dp = new Array(arr.length + 1).fill(0).map(() => new Array(arr.length + 1).fill(0));
	dp[-1] = new Array(arr.length).fill(0);

	for (let i = -1; i < dp.length; i++) dp[i][-1] = 0;

	for (let i = 0; i < arr.length; i++) {

		dp[i][i] = 1;

	}

	for (let len = 2; len <= arr.length; len++) {

		for (let i = 0; i < arr.length - len + 1; i++) {

			const j = i + len - 1;
			const startS = arr[i];
			const endS = arr[j];
			const lastSameSymbIndex = indexes[startS][j].left;
			const firstSameSymbIndex = indexes[endS][i].right;

			dp[i][j] = Math.max(
				dp[i+1][j],
				dp[i][j-1],
				(lastSameSymbIndex === -1 ? 0 : dp[i+1][lastSameSymbIndex-1] + 2 * (arr[i] === arr[lastSameSymbIndex] && i !== lastSameSymbIndex)),
				(firstSameSymbIndex === -1 ? 0 : dp[firstSameSymbIndex+1][j-1] + 2 * (arr[firstSameSymbIndex] === arr[j] && j !== firstSameSymbIndex)),
			);

		}

	}

	return dp;

}

console.dir(main('abaab'));
