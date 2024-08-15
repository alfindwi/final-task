// mencari bilangan prima
function bilanganPrima(num) {
    if (num <= 1) return false; 
    if (num <= 3) return true; 

    // jika bilangan habis dibagi 2 atau 3, bukan bilangan prima
    if (num % 2 === 0 || num % 3 === 0 ) return false;

    // jika bilangan habis dibagi i atau i + 2, bukan bilangan prima
    for(let i = 5; i * i <= num;  i += 6){
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true; 
}

// menghasilkan dan mengembalikan sebuah array yang berisi bilangan prima 
function generatePrima(count) {
    const primes = []; // array untuk menyimpan bilangan prima
    let num = 2;

    while(primes.length <= count){ // looping sampai primes.length lebih kecil atau sama dengan dari count
        if(bilanganPrima(num)){  // jika bilangan prima ditemukan maka mengembalikan true
            primes.push(num);   // menambahkan bilangan prima ke dalam array
        }
        num++; 
    }

    return primes;
}

// membuat segitiga

function printTriangle(prima, baris) { 
    let index = 0;
    for(let i = 1; i <= baris ; i++){
        let row = '';
        for(let a = 0; a < i; a++){ 
            row += prima[index] + ' '; // menambahkan bilangan prima ke dalam row
            index++; // menambahkan angka index
        }
        console.log(row);
    }
}

// membuat pola segitiga menggunakan bilangan prima 

function createPrimeTriangle(heightBase) {
    if(heightBase < 0 || heightBase > 10){ // jika heightBase kurang dari 0 atau lebih dari 10 maka false 
        return;
    }
    
    const totalPrima = (heightBase * (heightBase + 1)) / 2; // menghitung total bilangan prima
    const prima = generatePrima(totalPrima); // mengenerate bilangan prima

    printTriangle(prima, heightBase); // mencetak segitiga bilangan prima dengan heightBase yang ditentukan
}

createPrimeTriangle(7); 