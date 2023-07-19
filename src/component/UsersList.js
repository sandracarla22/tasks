const UserList = ({ arr }) => {

    function StatusItem(){
        let status = "(Off-Line)";

        if(arr.online === 1){
            status = "(On-Line)"
        }
        
        return (
            <span>{status}</span>
        )
    }

    return (
        <div className='row'>
            <div className='ml10'>
                <div className='col-20 subItem'>
                    <StatusItem/>
                </div>
                <div className='col-70'>
                    {arr.name}
                </div>
            </div>
        </div>
    )
}

export default UserList;