function showSnackBar(snack){

    snack.classList.add('show')
    setTimeout(()=>{
       
        snack.classList.remove('show')
      },4000)
}
export default showSnackBar