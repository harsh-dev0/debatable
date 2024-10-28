'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { usePathname, useRouter } from 'next/navigation'

interface EditorProps {
    subdebatableId: string
}


const Editor: FC<EditorProps> = ({ subdebatableId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subdebatableId,
            title: '',
            content: null,
        }
    })
    const ref = useRef<EditorJS>()
    const _titleRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }


    }, []);
    const intializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    // upload to uploadthing
                                    const [res] = await uploadFiles("imageUploader", {
                                        files: [file],
                                      });

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.url,
                                        },
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [])
    useEffect(() => {

        const init = async () => {
            await intializeEditor()

            setTimeout(() => {
                //setfocustotitle
            })
        }

        if(isMounted){
            init()

            return () => {}
        }

    }, [isMounted, intializeEditor]);
    return (
        <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>Editor
            <form
                id='subreddit-post-form'
                onSubmit={() => { }}>
                <div className='prose prose-stone dark:prose-invert'>
                    <TextareaAutosize
                        
                        placeholder='Title'
                        className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
                    /></div>
        <div id='editor' className='min-h-[500px]'/>
            </form>
        </div>

    )
}

export default Editor