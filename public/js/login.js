const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const signBtn = document.querySelector(".btn-wrapper .sign");
const loginBtn = document.querySelector(".btn-wrapper .login");

const logHandler = async (type) => {
  let email = emailInput.value;
  let password = passwordInput.value;
  if (!email || !password) {
    alert("Cant be empty");
    return;
  }
  let apiurl = type == "sign" ? "register" : "login";

  try {
    const res = await fetch(`http://localhost:3000/api/user/${apiurl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const log = await res.json();
    if(log.error){
      throw new Error(log.error.message || '登入失敗')
    }
      
    if(type !== 'sign' && log.token){
      document.cookie = `token=${log.token}; max-age=3600; path=/; SameSite=Strict;`;
      window.location.href = '/todo.html';
    }else {
      alert('註冊成功，請直接登入')
    }
  } catch (error) {
    alert(error)
    console.error(error);
  }
};

signBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logHandler("sign");
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logHandler("login");
});
