export const getErrorMessage = (err: any) : string => {

    if (err.error && typeof err.error === 'object' && err.error.message) {
        console.log(err.error.message);
        return err.error.message;
    } else {
        console.log(err);
        return "Something went wrong, please contact the developer.";
    }

}
