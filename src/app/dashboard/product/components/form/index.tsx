"use client"
import { ChangeEvent, useState } from 'react'
import styles from './styles.module.scss'
import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { getCookieClient } from '@/lib/cookieClient'
import { toast } from 'sonner'

import { Button } from '@/app/dashboard/components/button'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'

interface CategoryProps {
    id: string;
    name: string;
}

interface Props {
    categories: CategoryProps[]
}

export function Form({ categories }: Props){
    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("");
    const router = useRouter();

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]

            if(image.type !== "image/jpeg" && image.type !== "image/png"){
                toast.warning("formato de arquivo inválido!")
                return;
            }

            setImage(image);
            setPreviewImage(URL.createObjectURL(image))
        }
    }

    async function handleRegisterProduct(formData: FormData){

        const categoryIndex = formData.get("category");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");

        if(!name || !categoryIndex || !price || !description || !image){
            toast.warning("Verifique os campos digitados!")
            return;
        }

        const data = new FormData();

        data.append("name", name)
        data.append("price", price)
        data.append("description", description)
        data.append("category_id", categories[Number(categoryIndex)].id)
        data.append("file", image)

        const token = getCookieClient();

        await api.post("/product", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch((error) => {
            toast.warning("Erro ao cadastrar produto!")
            console.log(error)
            return;
        })

        toast.success("Produto cadastrado com sucesso!")
        router.push("/dashboard");
    }

    return(
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form action={handleRegisterProduct} className={styles.form}>

                <label className={styles.labelImage}>
                    <span>
                        <UploadCloud size={30} color='#FFF'/>
                    </span>

                    <input 
                        type="file" 
                        accept='image/png, image/jpeg'
                        required
                        onChange={handleFile}
                    />

                    {previewImage && (
                        <Image
                            alt='Imagem de preview'
                            src={previewImage}
                            className={styles.preview}
                            fill={true}
                            quality={100}
                            priority={true}
                        />
                    )}
                </label>

                <select name="category">
                    {categories.map((categorie, index) => (
                        <option key={categorie.id} value={index}>
                            {categorie.name}
                        </option>
                    ))}
                </select>

                <input 
                    type="text" 
                    name='name'
                    placeholder='Digite o nome do produto'
                    required
                    className={styles.input}
                />

                <input 
                    type="text" 
                    name='price'
                    placeholder='Digite o valor do produto'
                    required
                    className={styles.input}
                />

                <textarea 
                    name="description"
                    placeholder='Digite a descriação do produto'
                    required
                    className={styles.input}    
                ></textarea>

                <Button name='Cadastrar Produto' />
                
            </form>
        </main>
    )
}