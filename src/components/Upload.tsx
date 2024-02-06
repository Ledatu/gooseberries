// import React, { useRef, useState } from 'react';

// export type UploadProps = {
//     onUpload: (data: unknown) => void;
//     className?: string;
//     children: React.ReactNode;
//     overlay?: boolean;
//     disabled?: boolean;
// };

// const Upload = ({onUpload, disabled, overlay = true, children, className}: UploadProps) => {
//     const [progress, setProgress] = useState(0);
//     const [loading, setLoading] = useState(false);

//     const abortUploading = useRef<() => void>();

//     const abort = () => {
//         abortUploading.current?.();
//         reset();
//     };

//     const reset = () => {
//         setLoading(false);
//         setProgress(0);
//     };

//     const handleFile = (file: File) => {
//         if (loading || !file) return;

//         setLoading(true);
//         const uploading = upload<T>(file, url, {onProgress: setProgress});
//         abortUploading.current = uploading.abort;
//         uploading
//             .then(onUpload)
//             .catch((e) => {})
//             .finally(reset);
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         handleFile(event.target.files[0]);
//     };

//     const id = useId();
//     return (
//         <div className={cn(s.root, className)}>
//             {children}
//             <label htmlFor={id} className={cn(s.label, overlay && s.visible)}>
//                 <input
//                     disabled={disabled}
//                     type="file"
//                     className={s.input}
//                     onChange={handleFileChange}
//                     id={id}
//                 />
//                 <UploadOutlined className={s.icon} />
//             </label>
//             {loading && (
//                 <div className={s.loading}>
//                     <LoadingOutlined className={s.icon} />
//                     <ProgressIndicator progress={progress} className={s.progress} theme="green" />
//                     <CloseCircleOutlined className={s.abort} onClick={abort} />
//                 </div>
//             )}
//         </div>
//     );
// };
