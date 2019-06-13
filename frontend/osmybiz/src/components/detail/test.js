let i = 0;

function countNumbers() {
  console.log('worker');
  if (i < 100) {
    i += 1;
    postMessage(i);
  }
}

countNumbers();

