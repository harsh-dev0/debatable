'use client'
import { cn } from '@/lib/utils'
import { FC, useState } from 'react'
import { Button } from './ui/Button'
import { signIn } from 'next-auth/react'
import { Icons } from './Icons'
import { Toast } from './ui/Toast'
import { useToast } from '@/hooks/use-toast'
import { error } from 'console'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {

  const [isloading, setIsLoading] = useState<boolean>(false);
  const { toast } =  useToast()


  const loginwithgoogle = async ()=>{
    setIsLoading(true);

    try {
        
      await signIn('google')
    } catch (error) {
      //toast notification
      toast({
        title: 'There was a problem.',
        description: 'There was a error, logging in with google',
        variant: 'destructive',
      
      })

    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
      onClick={loginwithgoogle}
      isLoading={isloading}
      size='sm' className='w-full'>
      {isloading? null : <Icons.google className='h-4 w-4 mr-2'/>}
      Google
      </Button>
    </div>
  )
}

export default UserAuthForm