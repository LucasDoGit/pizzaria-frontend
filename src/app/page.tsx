import styles from './page.module.scss';
import logoImg from '/public/logo.svg'
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/services/api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Page(){

  async function handleLogin(formData: FormData){
    "use server"

    let email = formData.get('email');
    let password = formData.get('password');

    if(email === '' || password === ''){
      return
    }

    try {
      const response = await api.post('/session', {
        email,
        password
      })

      if(!response.data.token){
        return
      }

      // calculo de tempo de expiração do cookie (doc next)
      const expressTime = 60 * 60 * 24 * 30 * 1000;

      cookies().set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"
      })

    } catch (error) {
      console.log('Error: ', error)
    }

    redirect('/dashboard')
  }

  async function handleLoginDemo(){
    "use server"

    const email = "demo@demo.com";
    const password = "demo123";

    try {
      const response = await api.post('/session', {
        email,
        password
      })

      if(!response.data.token){
        return
      }

      const expressTime = 60 * 60 * 24 * 30 * 1000;

      cookies().set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"
      })

    } catch (error) {
      console.log('Error: ', error)
    }

    redirect('/dashboard')
  }

  return(
    <>
      <div className={styles.containerCenter}>
        <Image 
          src={logoImg}
          alt='Logo da pizzaria'
        />

        <section className={styles.login}>
          
          <form>
              <input 
                type="email" 
                
                name='email'
                placeholder='Digite seu email...'
                className={styles.input}
              />

              <input 
                type="password" 
                
                name='password'
                placeholder='***************'
                className={styles.input}
              />

              <button formAction={handleLogin} type='submit' className={styles.button}>
                Acessar
              </button>

              <button formAction={handleLoginDemo} className={styles.loginDemo}>
                Login Demo
              </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>

        </section>

      </div>
    </>
  )
}