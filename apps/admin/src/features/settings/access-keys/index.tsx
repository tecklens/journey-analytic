import {Input} from '@admin/components/ui/input'
import {Label} from '@admin/components/ui/label'
import {Button} from '@admin/components/ui/button'
import {IconCopy, IconEye, IconEyeOff} from '@tabler/icons-react'
import {useState} from 'react'
import {useToast} from "@admin/hooks/use-toast.ts";
import {useApiKeyQuery} from "@admin/api/project/api-key-query.ts";
import {get} from "lodash";
import ContentSection from '../components/content-section'

export default function AccessKeys() {
  const [show, setShow] = useState(false)
  const {toast} = useToast()
  const apiKey = useApiKeyQuery()

  const copyWorkflowIdentifier = (text: string, titleNoti: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: titleNoti,
        })
      })
  }

  return (
    <ContentSection
      title='API Key'
      desc="Use this API key to interact with the Journey Analytics API"
    >
      <div className={'flex flex-col space-y-8'}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className={'flex items-center space-x-2'}>
            <Input
              id={'api-key'}
              type={show ? 'text' : 'password'}
              placeholder="API KEY"
              className={'min-w-[350px]'}
              disabled
              value={get(apiKey.data, [0, 'key']) ?? ''}
            />
            <Button
              variant="outline" size="icon" className={'aspect-square'}
              onClick={() => setShow(!show)}
            >
              {show ? <IconEye size={18}/> : <IconEyeOff size={18}/>}
            </Button>
            <Button variant="outline" size="icon" className={'aspect-square'} onClick={() => {
              copyWorkflowIdentifier(get(apiKey.data, [0, 'key']) ?? '', 'API Key copied to clipboard')
            }}>
              <IconCopy size={18}/>
            </Button>
            <Button type="submit">Regenerate</Button>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="api-key">
            <div>Project ID</div>
            {/*<div className={'text-gray-700 text-xs'}>A public key identifier that can be exposed to the client*/}
            {/*  applications*/}
            {/*</div>*/}
          </Label>
          <div className={'flex items-center space-x-2'}>
            <Input
              id={'env-id'}
              disabled
              type="text"
              placeholder="Project ID"
              className={'min-w-[350px]'}
              value={get(apiKey.data, [0, 'projectId'])}
            />
            <Button variant="outline" size="icon" className={'aspect-square'}
                    onClick={() => {
                      copyWorkflowIdentifier(get(apiKey.data, [0, 'projectId']) ?? '', 'Environment Id copied to clipboard')
                    }}
            >
              <IconCopy size={18}/>
            </Button>
          </div>
        </div>
      </div>
    </ContentSection>
  )
}
