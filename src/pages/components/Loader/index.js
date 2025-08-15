import { Spin } from "antd";




export default function LoaderComponent() {



    return(
        <Spin className='flex justify-center mt-20' tip="Loading..." size="large">
        <div className="content" />
      </Spin>
    )
}