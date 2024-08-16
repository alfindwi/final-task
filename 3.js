function sort(array, n) { // mengurutkan array
    if (n <= 1) { // jika n kurang dari atau sama dengan 1 maka mengembalikan array
        return array;
    } 

    for (let i = 0; i < n - 1; i++) { // membandingkan dua bilangan 
        if (array[i] > array[i + 1]) { // jika array[i] lebih besar dari array[i + 1]
            [array[i], array[i + 1]] = [array[i + 1], array[i]];
        }
    } 

    return sort(array, n - 1); 
}

function sortArray(array) {
    const n = array.length;

    sort(array, n); // mengurutkan array

    const ganjil = array.filter(num => num % 2 !== 0); // menfilter bilangan ganjil dari array yang telah diurutkan sebelumnya 
    const genap = array.filter(num => num % 2 === 0); // menfilter bilangan ganap dari array yang telah diurutkan sebelumnya 

    return {
        arrayNumber: array.join(', '), // mengembalikan array yang telah diurutkan sebagai string
        ganjil: ganjil.join(', '),
        genap: genap.join(', '),    
    }
}

const inputArray = 	[2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];
const result = sortArray(inputArray);

console.log("Array:", result.arrayNumber);
console.log("Ganjil:", result.ganjil);
console.log("Genap:", result.genap);