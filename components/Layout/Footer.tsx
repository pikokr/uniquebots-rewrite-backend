import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Footer = () => {
  return (
    <div className="w-full mt-5 border-black border-t darK:border-white">
      <div className="container mx-auto">
        <div className="md:flex p-3 px-2">
          <div className="md:w-1/2 lg:w-1/3">
            <div className="text-2xl">UNIQUEBOTS</div>
            <div>디스코드 봇 리스트</div>
            <div className="flex gap-1 text-xl">
              <a
                href="https://github.com/pikokr/uniquebots-rewrite"
                target="_blank"
              >
                <FontAwesomeIcon icon={['fab', 'github']} />
              </a>
              <a href="https://discord.gg/NBdJdABkHG" target="_blank">
                <FontAwesomeIcon icon={['fab', 'discord']} />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 lg:w-1/3">
            <a target="_blank" href="/graphql">
              API
            </a>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-100 p-2">
        <div className="text-center">
          2021 &copy; UniqueCode | 대표 : 송찬우 | 사업자등록번호: 799-06-00477
        </div>
      </div>
    </div>
  )
}

export default Footer