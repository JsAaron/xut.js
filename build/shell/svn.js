require('child_process').exec('svnserve -d -r /Users/mac/svnserver', function(err, stdout, stderr) {
  if(err) {
    console.log('get weather api error:' + stderr);
  } else {
    console.log(stdout);
  }
});
